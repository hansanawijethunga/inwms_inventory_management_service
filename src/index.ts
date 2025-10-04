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
const app = express();
app.use(bodyParser.json());


app.post('/inventory/shipments/receive', InventoryShipmentController.receiveBulk);
app.post('/inventory/remove', InventoryRemoveController.bulkRemove);
app.post('/inventory/adjust', InventoryAdjustController.bulkAdjust);

// --- GET Endpoints ---
app.get('/api/receipts/:id', StockReceiptController.getReceiptById);
app.get('/api/balance', InventoryBalanceController.getBalanceByKey);
app.get('/inventory/balances', InventoryBalanceController.list);
app.get('/inventory/products/:productId/stock', InventoryProductStockController.getByProductId);
app.get('/inventory/ledger', InventoryLedgerQueryController.list);
app.get('/inventory/shipments/:shipment_id', InventoryShipmentQueryController.getByShipmentId);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
