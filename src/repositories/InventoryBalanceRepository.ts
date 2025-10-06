import { InventoryBalance } from '../domain/InventoryBalance.js';
import type { IInventoryBalanceRepository } from '../domain/interfaces/IInventoryBalanceRepository.js';
import sql from '../infrastructure/db.js';
export class InventoryBalanceRepository implements IInventoryBalanceRepository {
  async save(balance: InventoryBalance, sqlOrTx: any = sql): Promise<void> {
    await sqlOrTx`
      INSERT INTO inventorybalance (
        id, company_id, product_id, product_name, product_code, block_id, block_address, condition, expiry_date, on_hand, reserved, available, uom, last_updated_at
      ) VALUES (
        ${balance.id},
        ${balance.companyId},
        ${balance.productId},
        ${balance.productName ?? null},
        ${balance.productCode ?? null},
        ${balance.blockId},
        ${balance.blockAddress ?? null},
        ${balance.condition ?? null},
        ${balance.expiryDate ?? null},
        ${Number(balance.onHand)},
        ${balance.reserved !== undefined && balance.reserved !== null ? Number(balance.reserved) : null},
        ${Number(balance.available)},
        ${balance.uom ?? null},
        ${balance.lastUpdatedAt}
      )
      ON CONFLICT (company_id, product_id, block_id, condition) DO UPDATE SET
        product_name = EXCLUDED.product_name,
        product_code = EXCLUDED.product_code,
        block_address = EXCLUDED.block_address,
        on_hand = EXCLUDED.on_hand,
        reserved = EXCLUDED.reserved,
        available = EXCLUDED.available,
        uom = EXCLUDED.uom,
        last_updated_at = EXCLUDED.last_updated_at;
    `;
  }

  async findByKey(
    companyId: string,
    productId: string,
    blockId: string,
    condition: string,
    expiryDate?: Date,
    sqlOrTx: any = sql
  ): Promise<InventoryBalance | null> {
  const result = await sqlOrTx`
  SELECT * FROM inventorybalance
      WHERE company_id = ${companyId}
        AND product_id = ${productId}
        AND block_id = ${blockId}
        AND condition = ${condition}
        AND expiry_date IS NOT DISTINCT FROM ${expiryDate ?? null}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new InventoryBalance({
      companyId: row.company_id,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      blockId: row.block_id,
      blockAddress: row.block_address,
      condition: row.condition,
      expiryDate: row.expiry_date ?? undefined,
      onHand: row.on_hand,
      reserved: row.reserved ?? undefined,
      available: row.available,
      uom: row.uom,
      lastUpdatedAt: row.last_updated_at
    });
  }

  async findAllByFilter(filter: any, sqlOrTx: any = sql): Promise<InventoryBalance[]> {
    
    // Defensive: ensure filter is an object
    if (typeof filter !== 'object' || filter === null) {
      filter = {};
    }
    // console.log('Filter received in findAllByFilter:', filter);
    let query = 'SELECT * FROM inventorybalance WHERE 1=1';
    const params: any[] = [];
    if (filter.companyId) {
      query += ' AND company_id = $' + (params.length + 1);
      params.push(Array.isArray(filter.companyId) ? filter.companyId[0] : filter.companyId);
    }
    if (filter.productId) {
      query += ' AND product_id = $' + (params.length + 1);
      params.push(Array.isArray(filter.productId) ? filter.productId[0] : filter.productId);
    }
    if (filter.blockId) {
      query += ' AND block_id = $' + (params.length + 1);
      params.push(Array.isArray(filter.blockId) ? filter.blockId[0] : filter.blockId);
    }
      const result = await sqlOrTx.unsafe(query, params);
    console.log('Result from findAllByFilter:', result);
    return result.map((row: any) => new InventoryBalance({
      companyId: row.company_id,
      productId: row.product_id,
      productName: row.product_name,
      productCode: row.product_code,
      blockId: row.block_id,
      blockAddress: row.block_address,
      condition: row.condition,
      expiryDate: row.expiry_date ?? undefined,
      onHand: row.on_hand,
      reserved: row.reserved ?? undefined,
      available: row.available,
      uom: row.uom,
      lastUpdatedAt: row.last_updated_at
    }));
  }
}
