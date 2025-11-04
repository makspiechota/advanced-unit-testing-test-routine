import { IUserRepository } from './application/ports/user-repository/user-repository.interface';
import { IEmailSender } from './application/ports/email-sender/email-sender.interface';

export interface UserData {
  email: string;
  name: string;
  password: string;
}

export interface RegistrationResult {
  success: boolean;
  userId?: number;
  error?: string;
}

/**
 * UserRegistrationService
 *
 * This service orchestrates user registration using hexagonal architecture.
 * It depends on ports (interfaces) rather than concrete implementations.
 */
export class UserRegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private emailSender: IEmailSender
  ) {}

  async registerUser(userData: UserData): Promise<RegistrationResult> {
    try {
      // 1. Validate input (email format, required fields)
      this.validateInput(userData);

      // 2. Check if user already exists in database
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // 3. Hash the password (simple implementation for this exercise)
      const passwordHash = userData.password + '-hashed';

      // 4. Save new user to database
      const newUser = await this.userRepository.createUser({
        email: userData.email,
        name: userData.name,
        passwordHash
      });

      // 5. Send welcome email
      await this.emailSender.sendEmail({
        to: userData.email,
        subject: 'Welcome to Our Service!',
        body: `Hello ${userData.name},\n\nWelcome to our service! Your account has been created successfully.`
      });

      return {
        success: true,
        userId: newUser.id
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  private validateInput(userData: UserData): void {
    if (!userData.email || !userData.name || !userData.password) {
      throw new Error('Missing required fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }
}
