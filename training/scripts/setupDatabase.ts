import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'user_registration',
  user: 'testuser',
  password: 'testpass',
});

async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Testing database connection...');
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully at:', result.rows[0].now);

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('Users table exists.');

      // Count existing users
      const countResult = await client.query('SELECT COUNT(*) FROM users');
      console.log(`Number of users in database: ${countResult.rows[0].count}`);
    } else {
      console.log('Warning: Users table does not exist. Did the init.sql run?');
    }

    client.release();
    await pool.end();
    console.log('Database setup verified successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
