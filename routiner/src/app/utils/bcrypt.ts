import bcrypt from "bcryptjs";

export async function verifyPassword(inputPassword: string, hashedPassword: string) {
  return bcrypt.compare(inputPassword, hashedPassword);
}