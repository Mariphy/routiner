import { hashPassword } from "@/app/lib/bcrypt";
 import { createUser, getUserByEmail } from "@/app/lib/user";
 
 export async function POST(req: Request) {
   const { name, email, password } = await req.json();
 
   const existingUser = await getUserByEmail(email);
   if (existingUser) {
     return new Response(JSON.stringify({ error: "User exists" }), { status: 409 });
   }
 
   const hashed = await hashPassword(password);
   await createUser({ name, email, password: hashed });
 
   return new Response(JSON.stringify({ message: "User created" }), { status: 201 });
 }