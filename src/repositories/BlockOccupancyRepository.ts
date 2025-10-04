import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import type { IBlockOccupancyRepository } from '../domain/interfaces/IBlockOccupancyRepository.js';
import sql from '../infrastructure/db.js';

export class BlockOccupancyRepository implements IBlockOccupancyRepository {
  async save(occupancy: BlockOccupancy): Promise<void> {
    await sql`
      INSERT INTO "BlockOccupancy" (
        block_id, block_address, block_area_m2, company_id, occupied_area_m2, remaining_area_m2, last_updated_at
      ) VALUES (
        ${occupancy.blockId},
        ${occupancy.blockAddress},
        ${occupancy.blockAreaM2 ?? null},
        ${occupancy.companyId},
        ${occupancy.occupiedAreaM2},
        ${occupancy.remainingAreaM2},
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

  async findByBlockAndCompany(blockId: string, companyId: string): Promise<BlockOccupancy | null> {
    const result = await sql`
      SELECT * FROM "BlockOccupancy"
      WHERE block_id = ${blockId} AND company_id = ${companyId}
    `;
    if (result.length === 0) return null;
    const row = result[0] as any;
    return new BlockOccupancy({
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      companyId: row.company_id,
      occupiedAreaM2: row.occupied_area_m2,
      remainingAreaM2: row.remaining_area_m2,
      lastUpdatedAt: row.last_updated_at
    });
  }

  async findAllByCompany(companyId: string): Promise<BlockOccupancy[]> {
    const result = await sql`
      SELECT * FROM "BlockOccupancy" WHERE company_id = ${companyId}
    `;
    return result.map((row: any) => new BlockOccupancy({
      blockId: row.block_id,
      blockAddress: row.block_address,
      blockAreaM2: row.block_area_m2 ?? undefined,
      companyId: row.company_id,
      occupiedAreaM2: row.occupied_area_m2,
      remainingAreaM2: row.remaining_area_m2,
      lastUpdatedAt: row.last_updated_at
    }));
  }
}
