import { StockReceiptHeader } from '../domain/StockReceiptHeader.js';
import { StockReceiptLine } from '../domain/StockReceiptLine.js';
import type { IStockReceiptRepository } from '../domain/interfaces/IStockReceiptRepository.js';
import { InventoryLedger, InventoryLedgerType } from '../domain/InventoryLedger.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';
import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import type { IInventoryLedgerRepository } from '../domain/interfaces/IInventoryLedgerRepository.js';
import type { IInventoryBalanceRepository } from '../domain/interfaces/IInventoryBalanceRepository.js';
import type { IBlockOccupancyRepository } from '../domain/interfaces/IBlockOccupancyRepository.js';
import sql from '../infrastructure/db.js';

export class StockReceiptService {
  constructor(
    private readonly repository: IStockReceiptRepository,
    private readonly ledgerRepository: IInventoryLedgerRepository,
    private readonly balanceRepository: IInventoryBalanceRepository,
    private readonly occupancyRepository: IBlockOccupancyRepository
  ) {}

  async createReceipt(header: StockReceiptHeader, lines: StockReceiptLine[]): Promise<void> {
    // Basic validation
    if (!header || !lines || lines.length === 0) {
      throw new Error('Header and at least one line are required');
    }
    // Check for duplicate
    const existing = await this.repository.findHeaderById(header.id);
    if (existing) {
      throw new Error('Receipt with this ID already exists');
    }
    // Transactional save
    await sql.begin(async (tx) => {
      // Save header
      await this.repository.saveHeader(header, tx);
      // Save all lines
      for (const line of lines) {
        await this.repository.saveLine(line, tx);
        // Record ledger entry
        const ledger = new InventoryLedger({
          type: InventoryLedgerType.RECEIVE,
          receiptLineId: line.id,
          shipmentId: header.shipmentId,
          shipmentNumber: header.shipmentNumber,
          lotNumber: header.lotNumber,
          companyId: header.companyId,
          companyLegalName: header.companyLegalName,
          productId: line.productId,
          productName: line.productName,
          productCode: line.productCode,
          blockId: line.blockId,
          blockAddress: line.blockAddress,
          condition: line.condition,
          quantity: line.quantity,
          uom: line.uom,
          ...('productAreaM2' in line && line.productAreaM2 !== undefined ? { productAreaM2: line.productAreaM2 } : {}),
          ...('requiresExpiry' in line && line.requiresExpiry !== undefined ? { requiresExpiry: line.requiresExpiry } : {}),
          ...('requiresSerial' in line && line.requiresSerial !== undefined ? { requiresSerial: line.requiresSerial } : {}),
          ...('handlingNotes' in line && line.handlingNotes !== undefined ? { handlingNotes: line.handlingNotes } : {}),
          ...('blockAreaM2' in line && line.blockAreaM2 !== undefined ? { blockAreaM2: line.blockAreaM2 } : {}),
          ...('serialNumbers' in line && line.serialNumbers !== undefined ? { serialNumbers: line.serialNumbers } : {}),
          ...('inventoryDate' in header && header.inventoryDate !== undefined ? { inventoryDate: header.inventoryDate } : {}),
          ...('expiryDate' in line && line.expiryDate !== undefined ? { expiryDate: line.expiryDate } : {}),
          ...('productItemsSnapshot' in line && line.productItemsSnapshot !== undefined ? { productItemsSnapshot: line.productItemsSnapshot } : {}),
          ...('notes' in header && header.notes !== undefined ? { notes: header.notes } : {}),
          ...('createdBy' in header && header.createdBy !== undefined ? { createdBy: header.createdBy } : {}),
        });
        await this.ledgerRepository.save(ledger, tx);
        // Update inventory balance
        const prevBalance = await this.balanceRepository.findByKey(
          header.companyId,
          line.productId,
          line.blockId,
          line.condition,
          line.expiryDate,
          tx
        );
        const newOnHand = (prevBalance?.onHand || 0) + line.quantity;
        const balanceProps: any = {
          companyId: header.companyId,
          productId: line.productId,
          productName: line.productName,
          productCode: line.productCode,
          blockId: line.blockId,
          blockAddress: line.blockAddress,
          condition: line.condition,
          onHand: newOnHand,
          available: newOnHand - (prevBalance?.reserved || 0),
          uom: line.uom,
          lastUpdatedAt: new Date()
        };
        if (line.expiryDate !== undefined) balanceProps.expiryDate = line.expiryDate;
        if (prevBalance?.reserved !== undefined) balanceProps.reserved = prevBalance.reserved;
        const balance = new InventoryBalance(balanceProps);
        await this.balanceRepository.save(balance, tx);
        // Update block occupancy
        const prevOccupancy = await this.occupancyRepository.findByBlockAndCompany(line.blockId, header.companyId, tx);
        const newOccupied = (prevOccupancy?.occupiedAreaM2 || 0) + (line.productAreaM2 || 0);
        const newRemaining = (prevOccupancy?.remainingAreaM2 || 0) - (line.productAreaM2 || 0);
        const occupancyProps: any = {
          blockId: line.blockId,
          blockAddress: line.blockAddress,
          blockAreaM2: line.blockAreaM2,
          companyId: header.companyId,
          productId: line.productId,
          occupiedAreaM2: newOccupied,
          remainingAreaM2: newRemaining,
          lastUpdatedAt: new Date()
        };
        const occupancy = new BlockOccupancy(occupancyProps);
        await this.occupancyRepository.save(occupancy, tx);
      }
    });
  }

  async getReceiptById(id: string): Promise<{ header: StockReceiptHeader | null; lines: StockReceiptLine[] }> {
    const header = await this.repository.findHeaderById(id);
    const lines = await this.repository.findLinesByReceiptId(id);
    return { header, lines };
  }
}
