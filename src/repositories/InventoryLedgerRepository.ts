import { InventoryLedger } from '../domain/InventoryLedger.js';
import type { IInventoryLedgerRepository } from '../domain/interfaces/IInventoryLedgerRepository.js';
import sql from '../infrastructure/db.js';
export class InventoryLedgerRepository implements IInventoryLedgerRepository {
  async save(ledger: InventoryLedger, sqlOrTx: any = sql): Promise<void> {
    await sqlOrTx`
      INSERT INTO inventoryledger (
        id, timestamp, type, receipt_line_id, shipment_id, shipment_number, lot_number, company_id, company_legal_name, product_id, product_name, product_code, product_area_m2, requires_expiry, requires_serial, handling_notes, block_id, block_address, block_area_m2, condition, quantity, uom, serial_numbers, inventory_date, expiry_date, product_items_snapshot, notes, reason, created_by, created_at, idempotency_key
      ) VALUES (
        ${ledger.id},
        ${ledger.timestamp ?? null},
        ${ledger.type},
        ${ledger.receiptLineId ?? null},
        ${ledger.shipmentId ?? null},
        ${ledger.shipmentNumber ?? null},
        ${ledger.lotNumber ?? null},
        ${ledger.companyId},
        ${ledger.companyLegalName ?? null},
        ${ledger.productId},
        ${ledger.productName ?? null},
        ${ledger.productCode ?? null},
        ${ledger.productAreaM2 ?? null},
        ${ledger.requiresExpiry ?? null},
        ${ledger.requiresSerial ?? null},
        ${ledger.handlingNotes ?? null},
        ${ledger.blockId},
        ${ledger.blockAddress ?? null},
        ${ledger.blockAreaM2 ?? null},
        ${ledger.condition ?? null},
        ${ledger.quantity},
        ${ledger.uom},
        ${ledger.serialNumbers ? JSON.stringify(ledger.serialNumbers) : null},
        ${ledger.inventoryDate ?? null},
        ${ledger.expiryDate ?? null},
        ${ledger.productItemsSnapshot ? JSON.stringify(ledger.productItemsSnapshot) : null},
        ${ledger.notes ?? null},
        ${ledger.reason ?? null},
        ${ledger.createdBy ?? null},
        ${ledger.createdAt},
        ${ledger.idempotencyKey ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        timestamp = EXCLUDED.timestamp,
        type = EXCLUDED.type,
        receipt_line_id = EXCLUDED.receipt_line_id,
        shipment_id = EXCLUDED.shipment_id,
        shipment_number = EXCLUDED.shipment_number,
        lot_number = EXCLUDED.lot_number,
        company_id = EXCLUDED.company_id,
        company_legal_name = EXCLUDED.company_legal_name,
        product_id = EXCLUDED.product_id,
        product_name = EXCLUDED.product_name,
        product_code = EXCLUDED.product_code,
        product_area_m2 = EXCLUDED.product_area_m2,
        requires_expiry = EXCLUDED.requires_expiry,
        requires_serial = EXCLUDED.requires_serial,
        handling_notes = EXCLUDED.handling_notes,
        block_id = EXCLUDED.block_id,
        block_address = EXCLUDED.block_address,
        block_area_m2 = EXCLUDED.block_area_m2,
        condition = EXCLUDED.condition,
        quantity = EXCLUDED.quantity,
        uom = EXCLUDED.uom,
        serial_numbers = EXCLUDED.serial_numbers,
        inventory_date = EXCLUDED.inventory_date,
        expiry_date = EXCLUDED.expiry_date,
        product_items_snapshot = EXCLUDED.product_items_snapshot,
        notes = EXCLUDED.notes,
        reason = EXCLUDED.reason,
        created_by = EXCLUDED.created_by,
        created_at = EXCLUDED.created_at,
        idempotency_key = EXCLUDED.idempotency_key;
    `;
  }

  async findById(id: string, sqlOrTx: any = sql): Promise<InventoryLedger | null> {
  const result = await sqlOrTx`
  SELECT * FROM inventoryledger WHERE id = ${id}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new InventoryLedger({
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      receiptLineId: row.receipt_line_id ?? undefined,
      shipmentId: row.shipment_id ?? undefined,
      shipmentNumber: row.shipment_number ?? undefined,
      lotNumber: row.lot_number ?? undefined,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      productAreaM2: row.product_area_m2 ?? undefined,
      requiresExpiry: row.requires_expiry ?? undefined,
      requiresSerial: row.requires_serial ?? undefined,
      handlingNotes: row.handling_notes ?? undefined,
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      condition: row.condition,
      quantity: row.quantity,
      uom: row.uom,
      serialNumbers: row.serial_numbers ? JSON.parse(row.serial_numbers) : undefined,
      inventoryDate: row.inventory_date ?? undefined,
      expiryDate: row.expiry_date ?? undefined,
      productItemsSnapshot: row.product_items_snapshot ? JSON.parse(row.product_items_snapshot) : undefined,
      notes: row.notes ?? undefined,
      reason: row.reason ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
      idempotencyKey: row.idempotency_key ?? undefined
    });
  }

  async findByReceiptLineId(receiptLineId: string, sqlOrTx: any = sql): Promise<InventoryLedger[]> {
  const result = await sqlOrTx`
  SELECT * FROM inventoryledger WHERE receipt_line_id = ${receiptLineId}
    `;
    return result.map((row: any) => new InventoryLedger({
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      receiptLineId: row.receipt_line_id ?? undefined,
      shipmentId: row.shipment_id ?? undefined,
      shipmentNumber: row.shipment_number ?? undefined,
      lotNumber: row.lot_number ?? undefined,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      productAreaM2: row.product_area_m2 ?? undefined,
      requiresExpiry: row.requires_expiry ?? undefined,
      requiresSerial: row.requires_serial ?? undefined,
      handlingNotes: row.handling_notes ?? undefined,
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      condition: row.condition,
      quantity: row.quantity,
      uom: row.uom,
      serialNumbers: row.serial_numbers ? JSON.parse(row.serial_numbers) : undefined,
      inventoryDate: row.inventory_date ?? undefined,
      expiryDate: row.expiry_date ?? undefined,
      productItemsSnapshot: row.product_items_snapshot ? JSON.parse(row.product_items_snapshot) : undefined,
      notes: row.notes ?? undefined,
      reason: row.reason ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
      idempotencyKey: row.idempotency_key ?? undefined
    }));
  }

  async findAllByFilter(filter: any, sqlOrTx: any = sql): Promise<InventoryLedger[]> {
    // Example: filter = { companyId, productId }
  let query = 'SELECT * FROM inventoryledger WHERE 1=1';
    const params: any[] = [];
    if (filter.companyId) {
      query += ' AND company_id = $' + (params.length + 1);
      params.push(filter.companyId);
    }
    if (filter.productId) {
      query += ' AND product_id = $' + (params.length + 1);
      params.push(filter.productId);
    }
    // Add more filters as needed
  const result = await sqlOrTx.unsafe(query, ...params);
    return result.map((row: any) => new InventoryLedger({
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      receiptLineId: row.receipt_line_id ?? undefined,
      shipmentId: row.shipment_id ?? undefined,
      shipmentNumber: row.shipment_number ?? undefined,
      lotNumber: row.lot_number ?? undefined,
      companyId: row.company_id,
      companyLegalName: row.company_legal_name,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      productAreaM2: row.product_area_m2 ?? undefined,
      requiresExpiry: row.requires_expiry ?? undefined,
      requiresSerial: row.requires_serial ?? undefined,
      handlingNotes: row.handling_notes ?? undefined,
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      condition: row.condition,
      quantity: row.quantity,
      uom: row.uom,
      serialNumbers: row.serial_numbers ? JSON.parse(row.serial_numbers) : undefined,
      inventoryDate: row.inventory_date ?? undefined,
      expiryDate: row.expiry_date ?? undefined,
      productItemsSnapshot: row.product_items_snapshot ? JSON.parse(row.product_items_snapshot) : undefined,
      notes: row.notes ?? undefined,
      reason: row.reason ?? undefined,
      createdBy: row.created_by ?? undefined,
      createdAt: row.created_at,
      idempotencyKey: row.idempotency_key ?? undefined
    }));
  }
}
