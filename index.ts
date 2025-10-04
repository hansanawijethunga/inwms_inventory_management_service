import dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables.');
  process.exit(1);
}

const sql = postgres(connectionString);
console.log(sql)
async function insertTestRecord() {
  try {
    // Insert a row into the Test table with the "name" field set to "redo"
    const result = await sql`
      INSERT INTO "Test" ("name") VALUES ('redo')
      RETURNING *;
    `;
    console.log('Inserted record:', result);
  } catch (error) {
    console.error('Database insert error:', error);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

insertTestRecord();

export default sql;
