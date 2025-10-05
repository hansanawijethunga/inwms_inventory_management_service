import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';

const blockOccupancyRepo = new BlockOccupancyRepository();

export { blockOccupancyRepo };