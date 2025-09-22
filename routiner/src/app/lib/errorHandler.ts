import { AppError } from './errors';

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

/**
 * Global error handler for API routes
 * Wraps route handlers to catch and handle errors consistently
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Handles errors and returns appropriate HTTP responses
 */
export function handleError(error: unknown): Response {
  console.error('API Error:', error);

  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Log error details
  if (isOperational) {
    console.warn('Operational Error:', message);
  } else {
    console.error('System Error:', error);
  }

  const errorResponse: ErrorResponse = {
    error: getErrorType(statusCode),
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Get error type based on status code
 */
function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 409:
      return 'Conflict';
    case 422:
      return 'Unprocessable Entity';
    case 500:
      return 'Internal Server Error';
    default:
      return 'Error';
  }
}

/**
 * Utility function to throw errors in a consistent way
 */
export function throwError(message: string, statusCode: number = 500): never {
  throw new AppError(message, statusCode);
}

/**
 * Utility function to validate required fields
 */
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
}
