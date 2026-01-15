const postgres = require('postgres');
require('dotenv').config();

async function createAiUser() {
  let sql;
  try {
    console.log('Creating AI Read-Only User (Direct Postgres)...');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in .env');
    }

    // Connect to the database
    sql = postgres(dbUrl);

    console.log('Connected to database.');

    // Create User (Role in Postgres)
    try {
        await sql`CREATE USER ai_reader WITH PASSWORD 'secure_ai_password'`;
        console.log('User ai_reader created.');
    } catch (e) {
        if (e.code === '42710') { // duplicate_object
            console.log('User ai_reader already exists.');
        } else {
            console.log('Error creating user:', e.message);
        }
    }

    // Grant Permissions
    try {
        // Grant connect on database (current db)
        // Note: In Postgres, you connect to a DB. 
        // We need to grant usage on schema public
        await sql`GRANT CONNECT ON DATABASE "postgres" TO ai_reader`; // Usually allows connect by default or specific db
        // Actually, we are connected to a specific DB. We should grant on *that* DB.
        // But postgres library connects to the one in URL.
        
        // Grant USAGE on public schema
        await sql`GRANT USAGE ON SCHEMA public TO ai_reader`;
        
        // Grant SELECT on all tables
        await sql`GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_reader`;
        
        // Default privileges for future tables
        await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_reader`;
        
        console.log('Permissions granted successfully.');
    } catch (e) {
        console.error('Error granting permissions:', e.message);
    }

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    if (sql) await sql.end();
  }
}

createAiUser();