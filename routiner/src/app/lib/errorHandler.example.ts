/**
 * Example usage of the global error handler
 * This file demonstrates how to use the error handling system in API routes
 */

import { withErrorHandler, validateRequired } from './errorHandler';
import { 
  ValidationError, 
  UnauthorizedError, 
  NotFoundError, 
  ConflictError,
  DatabaseError 
} from './errors';

// Example 1: Basic route with error handling
async function exampleGetHandler(req: Request) {
  // This will automatically throw a ValidationError if any field is missing
  const body = await req.json();
  validateRequired(body, ['id']);

  // Simulate some business logic that might fail
  if (body.id === 'invalid') {
    throw new ValidationError('Invalid ID format');
  }

  // Simulate database operation
  const user = await getUserById(body.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Example 2: Route with authentication
async function exampleProtectedHandler(req: Request) {
  const session = await getSession(req);
  if (!session) {
    throw new UnauthorizedError('Authentication required');
  }

  // Your protected logic here
  return new Response(JSON.stringify({ message: 'Success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Example 3: Route that might have conflicts
async function exampleCreateHandler(req: Request) {
  const body = await req.json();
  validateRequired(body, ['email', 'name']);

  // Check if resource already exists
  const existing = await getUserByEmail(body.email);
  if (existing) {
    throw new ConflictError('User with this email already exists');
  }

  // Create the resource
  const result = await createUser(body);
  if (!result) {
    throw new DatabaseError('Failed to create user');
  }

  return new Response(JSON.stringify({ user: result }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Export the wrapped handlers
export const GET = withErrorHandler(exampleGetHandler);
export const POST = withErrorHandler(exampleProtectedHandler);
export const PUT = withErrorHandler(exampleCreateHandler);

// Mock functions for demonstration
async function getUserById(id: string) {
  // Mock implementation
  return id === '123' ? { id, name: 'John' } : null;
}

async function getSession(req: Request) {
  // Mock implementation
  return req.headers.get('authorization') ? { user: { id: '1' } } : null;
}

async function getUserByEmail(email: string) {
  // Mock implementation
  return email === 'existing@example.com' ? { email } : null;
}

async function createUser(data: any) {
  // Mock implementation
  return { id: '123', ...data };
}
