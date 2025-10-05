
import { StockReceiptHeader } from '../domain/StockReceiptHeader.js';
import { StockReceiptLine } from '../domain/StockReceiptLine.js';
import type { IStockReceiptRepository } from '../domain/interfaces/IStockReceiptRepository.js';
import sql from '../infrastructure/db.js';

export class StockReceiptRepository implements IStockReceiptRepository {

  async findLineById(lineId: string, sqlOrTx = sql): Promise<StockReceiptLine | null> {
    const result = await sqlOrTx`
      SELECT * FROM stockreceiptline WHERE id = ${lineId}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new StockReceiptLine({
      id: row.id,
      receiptId: row.receipt_id,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      productAreaM2: row.product_area_m2,
      requiresExpiry: row.requires_expiry,
      requiresSerial: row.requires_serial,
      handlingNotes: row.handling_notes,
      quantity: row.quantity,
      uom: row.uom,
      serialNumbers: row.serial_numbers ? JSON.parse(row.serial_numbers) : undefined,
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2,
      condition: row.condition,
      expiryDate: row.expiry_date,
      productItemsSnapshot: row.product_items_snapshot ? JSON.parse(row.product_items_snapshot) : undefined,
      createdAt: row.created_at
    });
  }

  async updateLineQuantity(lineId: string, newQuantity: number, sqlOrTx = sql): Promise<void> {
    await sqlOrTx`
      UPDATE stockreceiptline SET quantity = ${newQuantity} WHERE id = ${lineId}
    `;
  }
  async saveHeader(header: StockReceiptHeader, sqlOrTx = sql): Promise<void> {
    const query = `INSERT INTO stockreceiptheader (
      id, shipment_id, shipment_number, lot_number, inventory_date, company_id, company_legal_name, notes, created_by, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) ON CONFLICT (id) DO UPDATE SET
      shipment_id = EXCLUDED.shipment_id,
      shipment_number = EXCLUDED.shipment_number,
      lot_number = EXCLUDED.lot_number,
      inventory_date = EXCLUDED.inventory_date,
      company_id = EXCLUDED.company_id,
      company_legal_name = EXCLUDED.company_legal_name,
      notes = EXCLUDED.notes,
      created_by = EXCLUDED.created_by,
      created_at = EXCLUDED.created_at;`;
    const values = [
      header.id,
      header.shipmentId,
      header.shipmentNumber ?? null,
      header.lotNumber ?? null,
      header.inventoryDate ?? null,
      header.companyId,
      header.companyLegalName ?? null,
      header.notes ?? null,
      header.createdBy ?? null,
      header.createdAt
    ];
    // console.log('saveHeader SQL:', query);
    // console.log('saveHeader values:', values);
  await sqlOrTx`
      INSERT INTO stockreceiptheader (
        id, shipment_id, shipment_number, lot_number, inventory_date, company_id, company_legal_name, notes, created_by, created_at
      ) VALUES (
        ${header.id},
        ${header.shipmentId},
        ${header.shipmentNumber ?? null},
        ${header.lotNumber ?? null},
        ${header.inventoryDate ?? null},
        ${header.companyId},
        ${header.companyLegalName ?? null},
        ${header.notes ?? null},
        ${header.createdBy ?? null},
        ${header.createdAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        shipment_id = EXCLUDED.shipment_id,
        shipment_number = EXCLUDED.shipment_number,
        lot_number = EXCLUDED.lot_number,
        inventory_date = EXCLUDED.inventory_date,
        company_id = EXCLUDED.company_id,
        company_legal_name = EXCLUDED.company_legal_name,
        notes = EXCLUDED.notes,
        created_by = EXCLUDED.created_by,
        created_at = EXCLUDED.created_at;
    `;
  }

  async saveLine(line: StockReceiptLine, sqlOrTx = sql): Promise<void> {
    const query = `INSERT INTO stockreceiptline (
      id, receipt_id, product_id, product_name, product_code, product_area_m2, requires_expiry, requires_serial, handling_notes, quantity, uom, serial_numbers, block_id, block_address, block_area_m2, condition, expiry_date, product_items_snapshot, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    ) ON CONFLICT (id) DO UPDATE SET
      receipt_id = EXCLUDED.receipt_id,
      product_id = EXCLUDED.product_id,
      product_name = EXCLUDED.product_name,
      product_code = EXCLUDED.product_code,
      product_area_m2 = EXCLUDED.product_area_m2,
      requires_expiry = EXCLUDED.requires_expiry,
      requires_serial = EXCLUDED.requires_serial,
      handling_notes = EXCLUDED.handling_notes,
      quantity = EXCLUDED.quantity,
      uom = EXCLUDED.uom,
      serial_numbers = EXCLUDED.serial_numbers,
      block_id = EXCLUDED.block_id,
      block_address = EXCLUDED.block_address,
      block_area_m2 = EXCLUDED.block_area_m2,
      condition = EXCLUDED.condition,
      expiry_date = EXCLUDED.expiry_date,
      product_items_snapshot = EXCLUDED.product_items_snapshot,
      created_at = EXCLUDED.created_at;`;
    const values = [
      line.id,
      line.receiptId,
      line.productId,
      line.productName ?? null,
      line.productCode ?? null,
      line.productAreaM2 ?? null,
      line.requiresExpiry ?? null,
      line.requiresSerial ?? null,
      line.handlingNotes ?? null,
      line.quantity,
      line.uom,
      line.serialNumbers ? JSON.stringify(line.serialNumbers) : null,
      line.blockId,
      line.blockAddress ?? null,
      line.blockAreaM2 ?? null,
      line.condition ?? null,
      line.expiryDate ?? null,
      line.productItemsSnapshot ? JSON.stringify(line.productItemsSnapshot) : null,
      line.createdAt
    ];
    // console.log('saveLine SQL:', query);
    // console.log('saveLine values:', values);
  await sqlOrTx`
      INSERT INTO stockreceiptline (
        id, receipt_id, product_id, product_name, product_code, product_area_m2, requires_expiry, requires_serial, handling_notes, quantity, uom, serial_numbers, block_id, block_address, block_area_m2, condition, expiry_date, product_items_snapshot, created_at
      ) VALUES (
        ${line.id},
        ${line.receiptId},
        ${line.productId},
        ${line.productName ?? null},
        ${line.productCode ?? null},
        ${line.productAreaM2 ?? null},
        ${line.requiresExpiry ?? null},
        ${line.requiresSerial ?? null},
        ${line.handlingNotes ?? null},
        ${line.quantity},
        ${line.uom},
        ${line.serialNumbers ? JSON.stringify(line.serialNumbers) : null},
        ${line.blockId},
        ${line.blockAddress ?? null},
        ${line.blockAreaM2 ?? null},
        ${line.condition ?? null},
        ${line.expiryDate ?? null},
        ${line.productItemsSnapshot ? JSON.stringify(line.productItemsSnapshot) : null},
        ${line.createdAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        receipt_id = EXCLUDED.receipt_id,
        product_id = EXCLUDED.product_id,
        product_name = EXCLUDED.product_name,
        product_code = EXCLUDED.product_code,
        product_area_m2 = EXCLUDED.product_area_m2,
        requires_expiry = EXCLUDED.requires_expiry,
        requires_serial = EXCLUDED.requires_serial,
        handling_notes = EXCLUDED.handling_notes,
        quantity = EXCLUDED.quantity,
        uom = EXCLUDED.uom,
        serial_numbers = EXCLUDED.serial_numbers,
        block_id = EXCLUDED.block_id,
        block_address = EXCLUDED.block_address,
        block_area_m2 = EXCLUDED.block_area_m2,
        condition = EXCLUDED.condition,
        expiry_date = EXCLUDED.expiry_date,
        product_items_snapshot = EXCLUDED.product_items_snapshot,
        created_at = EXCLUDED.created_at;
    `;
  }

  async findHeaderById(id: string, sqlOrTx = sql): Promise<StockReceiptHeader | null> {
  const result = await sqlOrTx`
  SELECT * FROM stockreceiptheader WHERE id = ${id}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new StockReceiptHeader({
      id: row.id,
      shipmentId: row.shipment_id,
      shipmentNumber: row.shipment_number,
      lotNumber: row.lot_number,
      inventoryDate: row.inventory_date,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      notes: row.notes ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at
    });
  }

  async findLinesByReceiptId(headerId: string, sqlOrTx = sql): Promise<StockReceiptLine[]> {
  const result = await sqlOrTx`
  SELECT * FROM stockreceiptline WHERE receipt_id = ${headerId}
    `;
    return result.map((row: any) => new StockReceiptLine({
      id: row.id,
      receiptId: row.receipt_id,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      productAreaM2: row.product_area_m2,
      requiresExpiry: row.requires_expiry,
      requiresSerial: row.requires_serial,
      handlingNotes: row.handling_notes,
      quantity: row.quantity,
      uom: row.uom,
      serialNumbers: row.serial_numbers ? JSON.parse(row.serial_numbers) : undefined,
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2,
      condition: row.condition,
      expiryDate: row.expiry_date,
      productItemsSnapshot: row.product_items_snapshot ? JSON.parse(row.product_items_snapshot) : undefined,
      createdAt: row.created_at
    }));
  }

  async findByShipmentId(shipmentId: string, sqlOrTx = sql): Promise<StockReceiptHeader[]> {
  const result = await sqlOrTx`
  SELECT * FROM stockreceiptheader WHERE shipment_id = ${shipmentId}
    `;
    return result.map((row: any) => new StockReceiptHeader({
      id: row.id,
      shipmentId: row.shipment_id,
      shipmentNumber: row.shipment_number,
      lotNumber: row.lot_number,
      inventoryDate: row.inventory_date,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      notes: row.notes ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at
    }));
  }

  async findByLotNumber(lotNumber: string, sqlOrTx = sql): Promise<StockReceiptHeader[]> {
  const result = await sqlOrTx`
  SELECT * FROM stockreceiptheader WHERE lot_number = ${lotNumber}
    `;
    return result.map((row: any) => new StockReceiptHeader({
      id: row.id,
      shipmentId: row.shipment_id,
      shipmentNumber: row.shipment_number,
      lotNumber: row.lot_number,
      inventoryDate: row.inventory_date,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      notes: row.notes ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at
    }));
  }
}
