-- Drops all tables in the schema (for dev only!)
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- No Company/Product/Block tables, just store IDs as UUID/text

-- Create StockReceiptHeader table
CREATE TABLE StockReceiptHeader (
    id UUID PRIMARY KEY,
    shipment_id TEXT NOT NULL,
    shipment_number TEXT,
    lot_number TEXT,
    inventory_date DATE,
    company_id UUID NOT NULL,
    company_legal_name TEXT,
    notes TEXT,
    created_by TEXT,
    created_at TIMESTAMP NOT NULL
);

-- Create StockReceiptLine table
CREATE TABLE StockReceiptLine (
    id UUID PRIMARY KEY,
    receipt_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name TEXT,
    product_code TEXT,
    product_area_m2 NUMERIC,
    requires_expiry BOOLEAN,
    requires_serial BOOLEAN,
    handling_notes TEXT,
    quantity NUMERIC NOT NULL,
    uom TEXT NOT NULL,
    serial_numbers JSONB,
    block_id UUID NOT NULL,
    block_address TEXT,
    block_area_m2 NUMERIC,
    condition TEXT,
    expiry_date DATE,
    product_items_snapshot JSONB,
    created_at TIMESTAMP NOT NULL
);

-- Create InventoryBalance table
CREATE TABLE InventoryBalance (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name TEXT,
    product_code TEXT,
    block_id UUID NOT NULL,
    block_address TEXT,
    condition TEXT,
    expiry_date DATE,
    on_hand NUMERIC NOT NULL,
    reserved NUMERIC,
    available NUMERIC NOT NULL,
    uom TEXT,
    last_updated_at TIMESTAMP NOT NULL
);

ALTER TABLE InventoryBalance
ADD CONSTRAINT inventorybalance_unique_key UNIQUE (company_id, product_id, block_id, condition);

-- Create InventoryLedger table
CREATE TABLE InventoryLedger (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP,
    type TEXT NOT NULL,
    receipt_line_id UUID,
    shipment_id TEXT,
    shipment_number TEXT,
    lot_number TEXT,
    company_id UUID NOT NULL,
    company_legal_name TEXT,
    product_id UUID NOT NULL,
    product_name TEXT,
    product_code TEXT,
    product_area_m2 NUMERIC,
    requires_expiry BOOLEAN,
    requires_serial BOOLEAN,
    handling_notes TEXT,
    block_id UUID NOT NULL,
    block_address TEXT,
    block_area_m2 NUMERIC,
    condition TEXT,
    quantity NUMERIC NOT NULL,
    uom TEXT NOT NULL,
    serial_numbers JSONB,
    inventory_date DATE,
    expiry_date DATE,
    product_items_snapshot JSONB,
    notes TEXT,
    reason TEXT,
    created_by TEXT,
    created_at TIMESTAMP NOT NULL,
    idempotency_key TEXT
);

-- Create BlockOccupancy table
CREATE TABLE BlockOccupancy (
    id UUID PRIMARY KEY,
    block_id UUID NOT NULL,
    block_address TEXT,
    block_area_m2 NUMERIC,
    company_id UUID NOT NULL,
    occupied_area_m2 NUMERIC,
    remaining_area_m2 NUMERIC,
    last_updated_at TIMESTAMP NOT NULL
);

ALTER TABLE BlockOccupancy
ADD CONSTRAINT blockoccupancy_unique_key UNIQUE (block_id, company_id);
