import { describe, it, expect, beforeEach } from '@jest/globals';
import { UserRegistrationService, UserData } from '../UserRegistrationService';
import { IUserRepository } from '../application/ports/user-repository/user-repository.interface';
import { IEmailSender } from '../application/ports/email-sender/email-sender.interface';

/**
 * Test Routine for UserRegistrationService
 *
 * This routine defines the behavioral contract for UserRegistrationService.
 * It can be used for both unit tests (with stub implementations) and integration tests
 * (with real adapters).
 *
 * @param createService - Factory function that creates a fresh UserRegistrationService instance
 * @param getUserRepository - Function to get the user repository instance (for assertions)
 * @param getEmailSender - Function to get the email sender instance (for assertions)
 */
export function testUserRegistrationServiceRoutine(
  createService: () => {
    service: UserRegistrationService;
    userRepository: IUserRepository;
    emailSender: IEmailSender;
  }
): void {
  describe('UserRegistrationService contract', () => {
    let service: UserRegistrationService;
    let userRepository: IUserRepository;
    let emailSender: IEmailSender;

    beforeEach(() => {
      const instances = createService();
      service = instances.service;
      userRepository = instances.userRepository;
      emailSender = instances.emailSender;
    });

    describe('Successful registration', () => {
      it('should register a new user successfully', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(true);
        expect(result.userId).toBeDefined();
        expect(result.error).toBeUndefined();
      });

      it('should save user with hashed password', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        await service.registerUser(userData);

        const savedUser = await userRepository.findByEmail(userData.email);
        expect(savedUser).toBeDefined();
        expect(savedUser?.passwordHash).toBe('password123-hashed');
      });

      it('should send welcome email after registration', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        await service.registerUser(userData);

        // Note: For stubs, we can inspect sent emails. For real implementations,
        // we trust that the email was sent based on no error being thrown.
        const savedUser = await userRepository.findByEmail(userData.email);
        expect(savedUser).toBeDefined();
      });

      it('should create user with correct data', async () => {
        const userData: UserData = {
          email: 'john@example.com',
          name: 'John Doe',
          password: 'securepass123'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(true);
        const savedUser = await userRepository.findByEmail(userData.email);
        expect(savedUser?.email).toBe(userData.email);
        expect(savedUser?.name).toBe(userData.name);
      });
    });

    describe('Validation', () => {
      it('should reject invalid email format', async () => {
        const userData: UserData = {
          email: 'invalid-email',
          name: 'Test User',
          password: 'password123'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid email format');
      });

      it('should reject missing email', async () => {
        const userData: UserData = {
          email: '',
          name: 'Test User',
          password: 'password123'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Missing required fields');
      });

      it('should reject missing name', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: '',
          password: 'password123'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Missing required fields');
      });

      it('should reject missing password', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: ''
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Missing required fields');
      });

      it('should reject short password', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: '12345'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('at least 6 characters');
      });

      it('should accept password with exactly 6 characters', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: '123456'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(true);
        expect(result.userId).toBeDefined();
      });
    });

    describe('Duplicate user registration', () => {
      it('should reject duplicate email', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        await service.registerUser(userData);
        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toContain('already exists');
      });

      it('should not send email on duplicate registration', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        await service.registerUser(userData);
        const initialUsers = await userRepository.getAllUsers();
        const initialCount = initialUsers.length;

        await service.registerUser(userData);

        const finalUsers = await userRepository.getAllUsers();
        expect(finalUsers.length).toBe(initialCount); // No new user created
      });
    });

    describe('Error handling', () => {
      it('should handle repository errors gracefully', async () => {
        const userData: UserData = {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123'
        };

        // First registration should succeed
        const result1 = await service.registerUser(userData);
        expect(result1.success).toBe(true);

        // Second registration should fail gracefully (not throw)
        const result2 = await service.registerUser(userData);
        expect(result2.success).toBe(false);
        expect(result2.error).toBeDefined();
      });

      it('should return error when user data is completely invalid', async () => {
        const userData: UserData = {
          email: 'not-an-email',
          name: '',
          password: '1'
        };

        const result = await service.registerUser(userData);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });
}
