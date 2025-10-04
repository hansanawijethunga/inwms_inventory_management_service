# Inventory Management Microservice

This is a Node.js microservice written in TypeScript using tsx. It connects to a PostgreSQL database (hosted on Supabase) and inserts a row into the `Test` table on startup.

## Prerequisites
- Node.js (v18+ recommended)
- Access to the Supabase PostgreSQL instance

## Setup
1. Clone this repository or copy the files to your project directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```env
   PG_CONNECTION_STRING=postgresql://postgres:rapidminds@gmailCom.@db.mzysfvikbubkpgoqtlwe.supabase.co:5432/postgres
   ```
   Replace the connection string if your credentials change.

## Usage
To run the service:
```sh
npx tsx index.ts
```

On startup, the service will connect to the database and insert a row into the `Test` table with a sample name.

## Notes
- Ensure the `Test` table exists in your database with a `name` field.
- If you encounter a `getaddrinfo ENOTFOUND` error, check your network connection and verify the Supabase database hostname is correct and accessible.

## Project Structure
- `index.ts` - Main entry point, handles DB connection and insert
- `.env` - Environment variables (not committed to version control)

## License
MIT
