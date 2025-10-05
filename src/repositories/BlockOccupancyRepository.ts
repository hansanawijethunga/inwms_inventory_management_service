import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import type { IBlockOccupancyRepository } from '../domain/interfaces/IBlockOccupancyRepository.js';
import sql from '../infrastructure/db.js';
export class BlockOccupancyRepository implements IBlockOccupancyRepository {
  async save(occupancy: BlockOccupancy, sqlOrTx: any = sql): Promise<void> {
    console.log('BlockOccupancyRepository.save occupancy:', occupancy);
    await sqlOrTx`
      INSERT INTO blockoccupancy (
        id, block_id, block_address, block_area_m2, company_id, product_id, occupied_area_m2, remaining_area_m2, last_updated_at
      ) VALUES (
        ${occupancy.id},
        ${occupancy.blockId},
        ${occupancy.blockAddress ?? null},
        ${occupancy.blockAreaM2 ?? null},
        ${occupancy.companyId},
        ${occupancy.productId},
        ${occupancy.occupiedAreaM2 ?? null},
        ${occupancy.remainingAreaM2 ?? null},
        ${occupancy.lastUpdatedAt}
      )
      ON CONFLICT (block_id, company_id) DO UPDATE SET
        block_address = EXCLUDED.block_address,
        block_area_m2 = EXCLUDED.block_area_m2,
        occupied_area_m2 = EXCLUDED.occupied_area_m2,
        remaining_area_m2 = EXCLUDED.remaining_area_m2,
        last_updated_at = EXCLUDED.last_updated_at;
    `;
  }

  async findByBlockAndCompany(blockId: string, companyId: string, sqlOrTx: any = sql): Promise<BlockOccupancy | null> {
  const result = await sqlOrTx`
  SELECT * FROM blockoccupancy
      WHERE block_id = ${blockId} AND company_id = ${companyId}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new BlockOccupancy({
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      companyId: row.company_id,
      productId: row.product_id,
      occupiedAreaM2: row.occupied_area_m2,
      remainingAreaM2: row.remaining_area_m2,
      lastUpdatedAt: row.last_updated_at
    });
  }

  async findAllByCompany(companyId: string, sqlOrTx: any = sql): Promise<BlockOccupancy[]> {
  const result = await sqlOrTx`
  SELECT * FROM blockoccupancy WHERE company_id = ${companyId}
    `;
  return result.map((row: any) => new BlockOccupancy({
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      companyId: row.company_id,
      productId: row.product_id,
      occupiedAreaM2: row.occupied_area_m2,
      remainingAreaM2: row.remaining_area_m2,
      lastUpdatedAt: row.last_updated_at
    }));
  }
}
