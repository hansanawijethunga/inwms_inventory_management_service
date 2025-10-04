import dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const sql = postgres(connectionString);

async function runMigrations() {
  const migrationsDir = path.resolve(
    decodeURIComponent(path.dirname(new URL(import.meta.url).pathname.replace(/^\/+([A-Za-z]:)/, '$1'))),
    'migrations'
  );
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const migration = fs.readFileSync(filePath, 'utf8');
    try {
      console.log(`Running migration: ${file}`);
      await sql.unsafe(migration);
      console.log(`Migration ${file} executed successfully.`);
    } catch (err) {
      console.error(`Error running migration ${file}:`, err);
      process.exit(1);
    }
  }
  await sql.end();
}

runMigrations();
