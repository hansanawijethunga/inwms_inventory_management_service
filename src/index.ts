import { InventoryLedgerQueryController } from './controllers/InventoryLedgerQueryController.js';
import { InventoryProductStockController } from './controllers/InventoryProductStockController.js';
import { InventoryShipmentQueryController } from './controllers/InventoryShipmentQueryController.js';
import express from 'express';
import { jwtAuth } from './middleware/jwtAuth.js';
import { roleAuth } from './middleware/roleAuth.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import sql from './infrastructure/db.js';
import fs from 'fs';
import path from 'path';
let pkg: any = { version: '0.0.0' };
try {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (e) {
  // fallback
}
import { StockReceiptController } from './controllers/StockReceiptController.js';
import { InventoryShipmentController } from './controllers/InventoryShipmentController.js';
import { InventoryBalanceController } from './controllers/InventoryBalanceController.js';
import { InventoryRemoveController } from './controllers/InventoryRemoveController.js';
import { InventoryAdjustController } from './controllers/InventoryAdjustController.js';
import { BlockSpaceController } from './controllers/BlockSpaceController.js';




const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check (no authentication) - placed before global auth middleware
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: pkg.version, time: new Date().toISOString() });
});

// Readiness - simple DB connectivity check
app.get('/ready', async (_req, res) => {
  try {
    await sql`SELECT 1`;
    res.json({ ready: true, db: 'ok' });
  } catch (err: any) {
    res.status(503).json({ ready: false, db: 'error', message: err.message });
  }
});

app.use(jwtAuth()); // Apply authentication to all APIs


app.post('/inventory/receive', roleAuth(['SUPER_ADMIN', 'INVENTORY_MANAGER']), InventoryShipmentController.receiveBulk);
app.post('/inventory/remove', roleAuth(['SUPER_ADMIN', 'INVENTORY_MANAGER']), InventoryRemoveController.bulkRemove);
app.post('/inventory/adjust', roleAuth(['SUPER_ADMIN', 'INVENTORY_MANAGER']), InventoryAdjustController.adjustLine);

// --- GET Endpoints ---
app.get('/inventory/balances', InventoryBalanceController.list);
app.get('/inventory/ledger', InventoryLedgerQueryController.list);
app.get('/inventory/receipts/:id', StockReceiptController.getReceiptById);
app.get('/inventory/companies/:companyId/products/:productId/stock', InventoryProductStockController.getByProductId);
app.get('/inventory/companies/:companyId/shipments/:shipment_id', InventoryShipmentQueryController.getByShipmentId);
app.get('/inventory/blocks/space', BlockSpaceController.getAvailableSpace);
app.get('/inventory/companies/:companyId/receipts', InventoryShipmentQueryController.getReceiptsWithStockByCompany);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
