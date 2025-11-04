import { Pool, PoolConfig } from 'pg';
import { IUserRepository, User, CreateUserData } from '../../../application/ports/user-repository/user-repository.interface';

/**
 * PostgreSQL adapter implementation of IUserRepository
 *
 * This adapter connects to a real PostgreSQL database and crosses the memory boundary.
 * Tests using this adapter are INTEGRATION tests.
 */
export class UserRepositoryPostgresqlAdapter implements IUserRepository {
  private pool: Pool;

  constructor(config?: PoolConfig) {
    this.pool = new Pool(
      config || {
        host: 'localhost',
        port: 5432,
        database: 'user_registration',
        user: 'testuser',
        password: 'testpass',
      }
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query(
        'SELECT id, email, name, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // Validate required fields (matching stub behavior)
    if (!userData.email || !userData.name || !userData.passwordHash) {
      throw new Error('Database error: Missing required fields');
    }

    try {
      const result = await this.pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"`,
        [userData.email, userData.name, userData.passwordHash]
      );

      return result.rows[0] as User;
    } catch (error) {
      // Check for unique constraint violation (duplicate email)
      if ((error as any).code === '23505') {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await this.pool.query(
        'SELECT id, email, name, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt" FROM users ORDER BY created_at DESC'
      );

      return result.rows as User[];
    } catch (error) {
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        'DELETE FROM users WHERE email = $1',
        [email]
      );

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
