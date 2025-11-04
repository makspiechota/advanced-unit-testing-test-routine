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
 * TODO: Implement this service following these requirements:
 *
 * 1. Validate input (email format, required fields)
 * 2. Verify email using the email verification API
 * 3. Check if user already exists in database
 * 4. Hash the password (for this exercise, just append '-hashed' to the password)
 * 5. Save new user to database
 * 6. Send welcome email
 * 7. Handle errors appropriately
 *
 */
export class UserRegistrationService {
  constructor() {}

  async registerUser(userData: UserData): Promise<RegistrationResult> {
    throw new Error("Not implemented");
  }
}
