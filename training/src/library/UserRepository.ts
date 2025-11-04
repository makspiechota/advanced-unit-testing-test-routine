/**
 * UserRepository - PostgreSQL client for user operations
 *
 * This repository handles user creation and queries in PostgreSQL
 */

import { Pool, PoolConfig } from 'pg';

export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
}

export class UserRepository {
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

  /**
   * Find a user by email address
   * @param email - The email to search for
   * @returns Promise resolving to user or null if not found
   */
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

  /**
   * Create a new user
   * @param userData - The user data to save
   * @returns Promise resolving to the created user with ID
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const result = await this.pool.query(
        `INSERT INTO users (email, name, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, email, name, password_hash as "passwordHash", created_at as "createdAt", updated_at as "updatedAt"`,
        [userData.email, userData.name, userData.passwordHash]
      );

      console.log(`User created successfully: ${result.rows[0].email} (ID: ${result.rows[0].id})`);

      return result.rows[0] as User;
    } catch (error) {
      // Check for unique constraint violation (duplicate email)
      if ((error as any).code === '23505') {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Database error: ${(error as Error).message}`);
    }
  }

  /**
   * Get all users
   * @returns Promise resolving to array of users
   */
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

  /**
   * Delete a user by email
   * @param email - The email of the user to delete
   * @returns Promise resolving to true if user was deleted
   */
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

  /**
   * Close the database connection pool
   * Call this when shutting down the application
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}
