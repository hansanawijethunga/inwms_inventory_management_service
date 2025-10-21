
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

  async findByShipmentIdAndCompany(shipmentId: string, companyId: string, sqlOrTx = sql): Promise<StockReceiptHeader[]> {
    const result = await sqlOrTx`
      SELECT * FROM stockreceiptheader WHERE shipment_id = ${shipmentId} AND company_id = ${companyId}
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

  async findHeadersWithPositiveLinesByCompany(companyId: string, sqlOrTx = sql): Promise<any[]> {
    // Fetch headers and their lines where line.quantity > 0 for the given company
    const rows = await sqlOrTx`
      SELECT
        h.id AS header_id,
        h.shipment_id AS header_shipment_id,
        h.shipment_number AS header_shipment_number,
        h.lot_number AS header_lot_number,
        h.inventory_date AS header_inventory_date,
        h.company_id AS header_company_id,
        h.company_legal_name AS header_company_legal_name,
        h.notes AS header_notes,
        h.created_by AS header_created_by,
        h.created_at AS header_created_at,
        l.id AS line_id,
        l.receipt_id AS line_receipt_id,
        l.product_id AS line_product_id,
        l.product_name AS line_product_name,
        l.product_code AS line_product_code,
        l.quantity AS line_quantity,
        l.uom AS line_uom,
        l.block_id AS line_block_id,
        l.block_address AS line_block_address
      FROM stockreceiptheader h
      JOIN stockreceiptline l ON l.receipt_id::text = h.id::text
      WHERE h.company_id::text = ${companyId} AND COALESCE(l.quantity, 0) > 0
      ORDER BY h.created_at DESC
    `;
    // Group rows by header id
    const map = new Map<string, any>();
    for (const row of rows) {
      const headerId = String(row.header_id);
      if (!map.has(headerId)) {
        map.set(headerId, {
          id: row.header_id,
          shipmentId: row.header_shipment_id,
          shipmentNumber: row.header_shipment_number,
          lotNumber: row.header_lot_number,
          inventoryDate: row.header_inventory_date,
          companyId: row.header_company_id,
          companyLegalName: row.header_company_legal_name,
          notes: row.header_notes ?? undefined,
          createdBy: row.header_created_by ?? undefined,
          createdAt: row.header_created_at,
          lines: [] as any[]
        });
      }
      const header = map.get(headerId);
      header.lines.push({
        id: row.line_id,
        receiptId: row.line_receipt_id,
        productId: row.line_product_id,
        productName: row.line_product_name,
        productCode: row.line_product_code,
        quantity: row.line_quantity,
        uom: row.line_uom,
        blockId: row.line_block_id,
        blockAddress: row.line_block_address
      });
    }
    return Array.from(map.values());
  }
}
