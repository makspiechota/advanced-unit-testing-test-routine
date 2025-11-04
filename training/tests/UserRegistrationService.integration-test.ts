import { describe, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { Pool } from 'pg';
import { UserRegistrationService } from '../src/UserRegistrationService';
import { UserRepositoryPostgresqlAdapter } from '../src/infrastructure/adapters/user-repository-postgresql/user-repository-postgresql.adapter';
import { EmailSenderHttpReliableAdapter } from '../src/infrastructure/adapters/email-sender-http-reliable/email-sender-http-reliable.adapter';
import { testUserRegistrationServiceRoutine } from '../src/__tests__/user-registration-service.test-routine';

/**
 * INTEGRATION TEST for UserRegistrationService using real adapters
 *
 * This test orchestrates the execution of the test routine with real implementations:
 * - UserRepositoryPostgresqlAdapter (connects to PostgreSQL database)
 * - EmailSenderHttpReliableAdapter (connects to reliable email service)
 *
 * Since the adapters connect to real external services, this IS an INTEGRATION test -
 * it CROSSES the memory boundary.
 *
 * Prerequisites:
 * - PostgreSQL database running on localhost:5432
 * - Reliable email service running on localhost:3003
 * - Run: docker-compose up -d && npm run services:start
 */
describe('UserRegistrationService - INTEGRATION (Real Adapters)', () => {
  let cleanupPool: Pool;
  let currentUserRepository: UserRepositoryPostgresqlAdapter | null = null;

  beforeAll(async () => {
    // Set up cleanup pool for database
    cleanupPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'user_registration',
      user: 'testuser',
      password: 'testpass',
    });

    // Increase timeout for integration tests
    jest.setTimeout(30000);
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanupPool.query('DELETE FROM users');
  });

  afterEach(async () => {
    // Close repository connection after each test
    if (currentUserRepository) {
      await currentUserRepository.close();
      currentUserRepository = null;
    }
  });

  afterAll(async () => {
    // Clean up database connections
    await cleanupPool.end();
  });

  // Act: Execute the test routine with the factory that creates real adapter instances
  testUserRegistrationServiceRoutine(() => {
    // Create fresh instances for each test
    const userRepository = new UserRepositoryPostgresqlAdapter();
    const emailSender = new EmailSenderHttpReliableAdapter('localhost', 3003);
    const service = new UserRegistrationService(userRepository, emailSender);

    // Keep track for cleanup
    currentUserRepository = userRepository;

    return {
      service,
      userRepository,
      emailSender
    };
  });
});
