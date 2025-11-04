import { IUserRepository, User, CreateUserData } from '../user-repository.interface';

/**
 * In-memory stub implementation of IUserRepository for unit testing
 *
 * This implementation keeps all data in memory and does not cross the memory boundary.
 * It's used for UNIT tests that test the behavioral contract without external dependencies.
 */
export class UserRepositoryStub implements IUserRepository {
  private users: Map<string, User> = new Map();
  private nextId: number = 1;

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.get(email);
    return user ? { ...user } : null;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // Validate required fields
    if (!userData.email || !userData.name || !userData.passwordHash) {
      throw new Error('Database error: Missing required fields');
    }

    // Check for duplicate email
    if (this.users.has(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const now = new Date();
    const user: User = {
      id: this.nextId++,
      email: userData.email,
      name: userData.name,
      passwordHash: userData.passwordHash,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(userData.email, user);
    return { ...user };
  }

  async getAllUsers(): Promise<User[]> {
    const users = Array.from(this.users.values());
    // Sort by creation date, newest first
    return users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(user => ({ ...user }));
  }

  async deleteUser(email: string): Promise<boolean> {
    return this.users.delete(email);
  }

  async close(): Promise<void> {
    // No-op for in-memory implementation
  }

  // Additional helper methods for testing
  clear(): void {
    this.users.clear();
    this.nextId = 1;
  }
}
