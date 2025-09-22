import { hashPassword } from "@/app/lib/bcrypt";
import { createUser, getUserByEmail } from "@/app/lib/actions/user";
import { SignupRequest } from "./dtos/SignupRequestDTO";
import { withErrorHandler, validateRequired } from "@/app/lib/errorHandler";
import { ConflictError, ValidationError, DatabaseError } from "@/app/lib/errors";

async function signupHandler(req: SignupRequest) {
  // Validate required fields
  validateRequired(req, ['name', 'email', 'password']);

  // Check if user already exists
  const existingUser = await getUserByEmail(req.email);
  if (existingUser) {
    throw new ConflictError("User already exists with this email");
  }

  // Hash password and create user
  const hashed = await hashPassword(req.password);
  const result = await createUser({ 
    name: req.name, 
    email: req.email, 
    password: hashed 
  });

  if (!result) {
    throw new DatabaseError("Failed to create user");
  }

  return new Response(JSON.stringify({ message: "User created successfully" }), { 
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const POST = withErrorHandler(signupHandler);