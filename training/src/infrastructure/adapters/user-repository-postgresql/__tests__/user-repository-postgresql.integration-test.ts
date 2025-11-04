import { describe, beforeAll, afterAll } from '@jest/globals';
import { Pool } from 'pg';
import { UserRepositoryPostgresqlAdapter } from '../user-repository-postgresql.adapter';
import { testUserRepositoryRoutine } from '../../../../application/ports/user-repository/__tests__/user-repository.test-routine';

/**
 * INTEGRATION TEST for UserRepository using PostgreSQL adapter
 *
 * This test orchestrates the execution of the test routine with the real PostgreSQL adapter.
 * Since the adapter connects to a real database, this IS an INTEGRATION test - it CROSSES
 * the memory boundary.
 */
describe('UserRepository - INTEGRATION (PostgreSQL Adapter)', () => {
  // Arrange: Instantiate the PostgreSQL adapter
  const repository = new UserRepositoryPostgresqlAdapter();
  let cleanupPool: Pool;

  beforeAll(async () => {
    // Clean up: Remove all users before running tests to ensure clean state
    cleanupPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'user_registration',
      user: 'testuser',
      password: 'testpass',
    });

    await cleanupPool.query('DELETE FROM users');
  });

  afterAll(async () => {
    // Clean up: Close database connections
    await cleanupPool.end();
    await repository.close();
  });

  // Act: Execute the test routine with the PostgreSQL adapter instance
  testUserRepositoryRoutine(repository);
});
