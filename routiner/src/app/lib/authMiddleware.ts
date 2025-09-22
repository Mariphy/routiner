import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";

export interface AuthenticatedUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  routines: any[];
  events: any[];
  tasks: any[];
}

export interface AuthContext {
  session: any;
  user: AuthenticatedUser;
  db: any;
}

/**
 * Higher-order function that wraps API route handlers with authentication
 * @param handler - The API route handler function
 * @returns Wrapped handler that includes authentication
 */
export function withAuth<T extends any[]>(
  handler: (req: Request, context: AuthContext, ...args: T) => Promise<Response>
) {
  return async (req: Request, ...args: T): Promise<Response> => {
    try {
      // Get session
      const session = await auth();
      
      if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Connect to database
      const { db } = await connectToDb();
      
      // Find user in database
      const user = await db.collection("users").findOne({ email: session.user.email });
      
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Create auth context
      const authContext: AuthContext = {
        session,
        user,
        db,
      };

      // Call the original handler with auth context
      return await handler(req, authContext, ...args);
    } catch (error) {
      console.error("Authentication error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

/**
 * Utility function to create authenticated route handlers
 * @param handlers - Object containing HTTP method handlers
 * @returns Object with authenticated handlers
 */
export function createAuthenticatedRoutes<T extends Record<string, any>>(handlers: T): T {
  const authenticatedHandlers = {} as T;
  
  for (const [method, handler] of Object.entries(handlers)) {
    if (typeof handler === 'function') {
      authenticatedHandlers[method as keyof T] = withAuth(handler) as T[keyof T];
    }
  }
  
  return authenticatedHandlers;
}

/**
 * Simple authentication check that returns user data or null
 * @returns Promise<AuthContext | null>
 */
export async function getAuthenticatedUser(): Promise<AuthContext | null> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return null;
    }

    const { db } = await connectToDb();
    const user = await db.collection("users").findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }

    return {
      session,
      user,
      db,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

