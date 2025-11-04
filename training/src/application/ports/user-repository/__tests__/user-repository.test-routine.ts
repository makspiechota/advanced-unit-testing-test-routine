import { describe, it, expect, beforeEach } from '@jest/globals';
import { IUserRepository, CreateUserData } from '../user-repository.interface';

/**
 * Test Routine for IUserRepository
 *
 * This routine defines the behavioral contract for any IUserRepository implementation.
 * It can be used for both unit tests (with stub implementations) and integration tests
 * (with real database adapters).
 *
 * @param repository - An instance of IUserRepository to test
 */
export function testUserRepositoryRoutine(repository: IUserRepository): void {
  describe('IUserRepository contract', () => {
    const testUserData: CreateUserData = {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashed-password-123'
    };

    const anotherUserData: CreateUserData = {
      email: 'another@example.com',
      name: 'Another User',
      passwordHash: 'hashed-password-456'
    };

    beforeEach(async () => {
      // Clean up any existing test users
      const existingUser = await repository.findByEmail(testUserData.email);
      if (existingUser) {
        await repository.deleteUser(testUserData.email);
      }

      const anotherExistingUser = await repository.findByEmail(anotherUserData.email);
      if (anotherExistingUser) {
        await repository.deleteUser(anotherUserData.email);
      }
    });

    describe('createUser', () => {
      it('should create a new user with all required fields', async () => {
        const createdUser = await repository.createUser(testUserData);

        expect(createdUser).toBeDefined();
        expect(createdUser.id).toBeDefined();
        expect(typeof createdUser.id).toBe('number');
        expect(createdUser.email).toBe(testUserData.email);
        expect(createdUser.name).toBe(testUserData.name);
        expect(createdUser.passwordHash).toBe(testUserData.passwordHash);
        expect(createdUser.createdAt).toBeInstanceOf(Date);
        expect(createdUser.updatedAt).toBeInstanceOf(Date);
      });

      it('should throw an error when creating a user with duplicate email', async () => {
        await repository.createUser(testUserData);

        await expect(
          repository.createUser(testUserData)
        ).rejects.toThrow(/already exists|duplicate/i);
      });

      it('should create multiple users with different emails', async () => {
        const user1 = await repository.createUser(testUserData);
        const user2 = await repository.createUser(anotherUserData);

        expect(user1.id).not.toBe(user2.id);
        expect(user1.email).toBe(testUserData.email);
        expect(user2.email).toBe(anotherUserData.email);
      });
    });

    describe('findByEmail', () => {
      it('should find an existing user by email', async () => {
        const createdUser = await repository.createUser(testUserData);

        const foundUser = await repository.findByEmail(testUserData.email);

        expect(foundUser).toBeDefined();
        expect(foundUser?.id).toBe(createdUser.id);
        expect(foundUser?.email).toBe(testUserData.email);
        expect(foundUser?.name).toBe(testUserData.name);
        expect(foundUser?.passwordHash).toBe(testUserData.passwordHash);
      });

      it('should return null when user does not exist', async () => {
        const foundUser = await repository.findByEmail('nonexistent@example.com');

        expect(foundUser).toBeNull();
      });

      it('should be case-sensitive when searching by email', async () => {
        await repository.createUser(testUserData);

        const foundUser = await repository.findByEmail(testUserData.email.toUpperCase());

        expect(foundUser).toBeNull();
      });
    });

    describe('getAllUsers', () => {
      it('should return an empty array when no users exist', async () => {
        const users = await repository.getAllUsers();

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(0);
      });

      it('should return all created users', async () => {
        await repository.createUser(testUserData);
        await repository.createUser(anotherUserData);

        const users = await repository.getAllUsers();

        expect(users.length).toBe(2);
        const emails = users.map(u => u.email);
        expect(emails).toContain(testUserData.email);
        expect(emails).toContain(anotherUserData.email);
      });

      it('should return users ordered by creation date (newest first)', async () => {
        const user1 = await repository.createUser(testUserData);
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
        const user2 = await repository.createUser(anotherUserData);

        const users = await repository.getAllUsers();

        expect(users[0].id).toBe(user2.id);
        expect(users[1].id).toBe(user1.id);
      });
    });

    describe('deleteUser', () => {
      it('should delete an existing user and return true', async () => {
        await repository.createUser(testUserData);

        const result = await repository.deleteUser(testUserData.email);

        expect(result).toBe(true);

        const foundUser = await repository.findByEmail(testUserData.email);
        expect(foundUser).toBeNull();
      });

      it('should return false when deleting non-existent user', async () => {
        const result = await repository.deleteUser('nonexistent@example.com');

        expect(result).toBe(false);
      });

      it('should allow creating a user again after deletion', async () => {
        await repository.createUser(testUserData);
        await repository.deleteUser(testUserData.email);

        const newUser = await repository.createUser(testUserData);

        expect(newUser).toBeDefined();
        expect(newUser.email).toBe(testUserData.email);
      });
    });

    describe('error handling', () => {
      it('should throw meaningful errors on database failures', async () => {
        await expect(
          repository.createUser({
            email: '',
            name: '',
            passwordHash: ''
          })
        ).rejects.toThrow();
      });
    });
  });
}
