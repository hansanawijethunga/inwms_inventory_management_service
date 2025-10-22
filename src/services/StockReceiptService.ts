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

    // Lot number consistency
    if (lines.some(line => ('lotNumber' in line) && (line as any).lotNumber !== header.lotNumber)) {
      throw new Error('All lines must have the same lotNumber as the header');
    }

    // Idempotency: check for duplicate shipmentId or lotNumber (if implemented)
    // Uncomment if you want to enforce this:
    // const existingShipment = await this.repository.findByShipmentId(header.shipmentId);
    // if (existingShipment) throw new Error('Duplicate shipmentId');

    // Validate each line
    for (const [i, line] of lines.entries()) {
      // Required fields (explicit access)
      if (!line.productId) throw new Error(`Line ${i + 1}: Field 'productId' is required`);
      if (!line.productName) throw new Error(`Line ${i + 1}: Field 'productName' is required`);
      if (!line.productCode) throw new Error(`Line ${i + 1}: Field 'productCode' is required`);
  if (line.quantity === undefined || line.quantity === null) throw new Error(`Line ${i + 1}: Field 'quantity' is required`);
      if (!line.uom) throw new Error(`Line ${i + 1}: Field 'uom' is required`);
      if (!line.blockId) throw new Error(`Line ${i + 1}: Field 'blockId' is required`);
      if (!line.blockAddress) throw new Error(`Line ${i + 1}: Field 'blockAddress' is required`);
      if (!line.condition) throw new Error(`Line ${i + 1}: Field 'condition' is required`);
      if (!line.createdAt) throw new Error(`Line ${i + 1}: Field 'createdAt' is required`);
      if (!header.companyId) throw new Error('companyId is required');

      // Type checks: accept either standard UUID or Mongo ObjectId (24 hex chars)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!(uuidRegex.test(line.productId) || mongoIdRegex.test(line.productId))) {
        throw new Error(`Line ${i + 1}: productId must be a valid UUID or a 24-character hex id`);
      }
      if (!(uuidRegex.test(line.blockId) || mongoIdRegex.test(line.blockId))) {
        throw new Error(`Line ${i + 1}: blockId must be a valid UUID or a 24-character hex id`);
      }
      if (typeof line.quantity !== 'number' || line.quantity <= 0) throw new Error(`Line ${i + 1}: quantity must be a positive number`);
      const allowedConditions = ['Good', 'Damaged', 'Expired'];
      if (!allowedConditions.includes(line.condition)) throw new Error(`Line ${i + 1}: condition must be one of: ${allowedConditions.join(', ')}`);

      // Serial number validation
      if (line.requiresSerial) {
        if (!Array.isArray(line.serialNumbers) || line.serialNumbers.length !== line.quantity) {
          throw new Error(`Line ${i + 1}: serialNumbers must be an array with length equal to quantity when requiresSerial is true`);
        }
      }

      // Expiry validation
      if (line.requiresExpiry) {
        if (!line.expiryDate || (typeof line.expiryDate === 'string' && isNaN(Date.parse(line.expiryDate))) || (line.expiryDate instanceof Date && isNaN(line.expiryDate.getTime()))) {
          throw new Error(`Line ${i + 1}: expiryDate must be present and a valid date when requiresExpiry is true`);
        }
      }

      // Product items snapshot
      if (line.productItemsSnapshot && !Array.isArray(line.productItemsSnapshot)) {
        throw new Error(`Line ${i + 1}: productItemsSnapshot must be an array if present`);
      }
    }

    // Block capacity validation (async, needs DB)
    for (const [i, line] of lines.entries()) {
      const neededArea = (line.productAreaM2 || 0) * (line.quantity || 0);
      const block = await this.occupancyRepository.findByBlockAndCompany(line.blockId, header.companyId);
      let remaining: number;
      if (block) {
        remaining = block.remainingAreaM2 ?? 0;
      } else {
        // Use blockAreaM2 from the line as the available area if no occupancy record exists
        remaining = line.blockAreaM2 || 0;
      }
      console.log(remaining);
      if (neededArea > remaining) {
        throw new Error(`Line ${i + 1}: Block does not have enough remaining area. Needed: ${neededArea}, Available: ${remaining}`);
      }
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
        const prevOnHand = Number(prevBalance?.onHand || 0);
        const prevReserved = Number(prevBalance?.reserved || 0);
        const qty = Number(line.quantity || 0);
        const newOnHand = prevOnHand + qty;
        const newAvailable = newOnHand - prevReserved;
        const balanceProps: any = {
          companyId: header.companyId,
          productId: line.productId,
          productName: line.productName,
          productCode: line.productCode,
          blockId: line.blockId,
          blockAddress: line.blockAddress,
          condition: line.condition,
          onHand: newOnHand,
          available: newAvailable,
          uom: line.uom,
          lastUpdatedAt: new Date()
        };
        if (line.expiryDate !== undefined) balanceProps.expiryDate = line.expiryDate;
        if (prevBalance?.reserved !== undefined) balanceProps.reserved = prevReserved;
        const balance = new InventoryBalance(balanceProps);
        await this.balanceRepository.save(balance, tx);
        // Update block occupancy
        const prevOccupancy = await this.occupancyRepository.findByBlockAndCompany(line.blockId, header.companyId, tx);
        const lineTotalArea = Number(line.productAreaM2 || 0) * Number(line.quantity || 0);
        let newOccupied: number;
        let newRemaining: number;
        if (prevOccupancy) {
          newOccupied = Number(prevOccupancy.occupiedAreaM2 || 0) + lineTotalArea;
          newRemaining = Number(prevOccupancy.remainingAreaM2 || 0) - lineTotalArea;
        } else {
          newOccupied = lineTotalArea;
          newRemaining = Number(line.blockAreaM2 || 0) - lineTotalArea;
        }
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
