import { describe } from '@jest/globals';
import { UserRepositoryStub } from '../user-repository.stub';
import { testUserRepositoryRoutine } from '../../__tests__/user-repository.test-routine';

/**
 * UNIT TEST for UserRepository using in-memory stub
 *
 * This test orchestrates the execution of the test routine with the stub implementation.
 * Since the stub operates entirely in memory, this is a UNIT test - it does NOT cross
 * the memory boundary.
 */
describe('UserRepository - UNIT (Stub Implementation)', () => {
  // Arrange: Instantiate the stub implementation
  const repository = new UserRepositoryStub();

  // Act: Execute the test routine with the stub instance
  testUserRepositoryRoutine(repository);
});
