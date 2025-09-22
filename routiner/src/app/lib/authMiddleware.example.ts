/**
 * Example usage of the authentication middleware
 * This file demonstrates different ways to use the auth middleware
 */

import { withAuth, createAuthenticatedRoutes, getAuthenticatedUser, AuthContext } from "./authMiddleware";

// Method 1: Using withAuth with individual handlers
async function getUserProfile(req: Request, context: AuthContext) {
    return new Response(JSON.stringify({ 
        user: {
            id: context.user._id,
            name: context.user.name,
            email: context.user.email
        }
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

// Export the authenticated handler
export const GET = withAuth(getUserProfile);

// Method 2: Using createAuthenticatedRoutes for multiple handlers
const userHandlers = {
    async GET(req: Request, context: AuthContext) {
        return new Response(JSON.stringify({ 
            message: "Get user data",
            user: context.user 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    },

    async PUT(req: Request, context: AuthContext) {
        const { name } = await req.json();
        
        await context.db.collection("users").updateOne(
            { email: context.user.email },
            { $set: { name } }
        );

        return new Response(JSON.stringify({ 
            message: "User updated successfully" 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
};

// Export all handlers with authentication
export const { GET: GET_USER, PUT: UPDATE_USER } = createAuthenticatedRoutes(userHandlers);

// Method 3: Using getAuthenticatedUser for conditional logic
export async function conditionalHandler(req: Request) {
    const authContext = await getAuthenticatedUser();
    
    if (!authContext) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Use authContext.user and authContext.db here
    return new Response(JSON.stringify({ 
        message: "Authenticated user data",
        user: authContext.user 
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

// Method 4: Custom authentication logic
export async function customAuthHandler(req: Request) {
    const authContext = await getAuthenticatedUser();
    
    if (!authContext) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Custom business logic here
    if (authContext.user.email === "admin@example.com") {
        return new Response(JSON.stringify({ 
            message: "Admin access granted",
            adminData: "sensitive data"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ 
        message: "Regular user access",
        user: authContext.user 
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

