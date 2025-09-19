export async function signup(formData: FormData) {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const name = formData.get("name")?.toString().trim();
  
    // Validation: Check if email and password are provided
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
  
    // Validation: Check if email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  
    // Validation: Check if password meets minimum requirements
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
  
    // Proceed with the API request if validation passes
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    if (response.status === 409) {
      throw new Error("User already exists");
    }
  
    if (!response.ok) {
      throw new Error("Failed to sign up");
    }
  
    return await response.json();
}