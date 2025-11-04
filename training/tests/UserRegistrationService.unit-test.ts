import { describe } from '@jest/globals';
import { UserRegistrationService } from "../src/UserRegistrationService";
import { UserRepositoryStub } from "../src/application/ports/user-repository/stub/user-repository.stub";
import { EmailSenderStub } from "../src/application/ports/email-sender/stub/email-sender.stub";
import { testUserRegistrationServiceRoutine } from "../src/__tests__/user-registration-service.test-routine";

/**
 * UNIT TEST for UserRegistrationService using stubs
 *
 * This test orchestrates the execution of the test routine with stub implementations.
 * Since the stubs operate entirely in memory, this is a UNIT test - it does NOT cross
 * the memory boundary.
 */
describe("UserRegistrationService - UNIT (Stub Implementations)", () => {
  // Act: Execute the test routine with the factory that creates stub-based instances
  testUserRegistrationServiceRoutine(() => {
    const userRepository = new UserRepositoryStub();
    const emailSender = new EmailSenderStub();
    const service = new UserRegistrationService(userRepository, emailSender);

    return {
      service,
      userRepository,
      emailSender
    };
  });
});
