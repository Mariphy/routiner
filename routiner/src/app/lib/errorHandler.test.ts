import { withErrorHandler, handleError } from './errorHandler';
import { AppError, ValidationError, ConflictError } from './errors';

// Mock test to demonstrate error handling
describe('Error Handler', () => {
  it('should handle AppError correctly', () => {
    const error = new ValidationError('Invalid input');
    const response = handleError(error);
    
    expect(response.status).toBe(400);
  });

  it('should handle unknown errors', () => {
    const error = new Error('Unknown error');
    const response = handleError(error);
    
    expect(response.status).toBe(500);
  });

  it('should wrap handlers with error handling', async () => {
    const mockHandler = jest.fn().mockRejectedValue(new ConflictError('User exists'));
    const wrappedHandler = withErrorHandler(mockHandler);
    
    const response = await wrappedHandler();
    
    expect(response.status).toBe(409);
  });
});
