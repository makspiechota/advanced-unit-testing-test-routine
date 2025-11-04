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

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(userData: CreateUserData): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(email: string): Promise<boolean>;
  close?(): Promise<void>;
}
