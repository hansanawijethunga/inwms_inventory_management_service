import { InventoryLedgerQueryController } from './controllers/InventoryLedgerQueryController.js';
import { InventoryProductStockController } from './controllers/InventoryProductStockController.js';
import { InventoryShipmentQueryController } from './controllers/InventoryShipmentQueryController.js';
import express from 'express';
import bodyParser from 'body-parser';
import { StockReceiptController } from './controllers/StockReceiptController.js';
import { InventoryShipmentController } from './controllers/InventoryShipmentController.js';
import { InventoryBalanceController } from './controllers/InventoryBalanceController.js';
import { InventoryRemoveController } from './controllers/InventoryRemoveController.js';
import { InventoryAdjustController } from './controllers/InventoryAdjustController.js';
import { BlockSpaceController } from './controllers/BlockSpaceController.js';


const app = express();
app.use(bodyParser.json());


app.post('/inventory/receive', InventoryShipmentController.receiveBulk);
app.post('/inventory/remove', InventoryRemoveController.bulkRemove);
app.post('/inventory/adjust', InventoryAdjustController.adjustLine);

// --- GET Endpoints ---
app.get('/inventory/balances', InventoryBalanceController.list);
app.get('/inventory/ledger', InventoryLedgerQueryController.list);
app.get('/inventory/receipts/:id', StockReceiptController.getReceiptById);
app.get('/inventory/companies/:companyId/products/:productId/stock', InventoryProductStockController.getByProductId);
app.get('/inventory/companies/:companyId/shipments/:shipment_id', InventoryShipmentQueryController.getByShipmentId);
app.get('/inventory/blocks/space', BlockSpaceController.getAvailableSpace);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
