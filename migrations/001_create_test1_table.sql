-- Migration: Create table test1 with column name
CREATE TABLE IF NOT EXISTS "test1" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);
