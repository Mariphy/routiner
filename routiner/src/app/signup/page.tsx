"use client";
 
 import { useRouter } from "next/navigation";
 import { useState } from "react";
 
 export default function SignUpPage() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
 
   async function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     setError("");

     try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 409) {
        setError("User already exists. Redirecting to login...");
        setTimeout(() => {
          router.push("/api/auth/signin"); // Redirect to the login page
        }, 2000); // Wait 2 seconds before redirecting
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      const data = await response.json();
      console.log(data.message); // "User created"
      router.push("/api/auth/signin"); // Redirect to login after successful signup
    } catch (err) {
        console.error(err);
      setError("An error occurred. Please try again.");
    }
   }
 
   return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100">
       <form
         onSubmit={handleSubmit}
         className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
       >
         <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
         <div className="mb-4">
           <input
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="Email"
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>
         <div className="mb-4">
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Password"
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>
         <button
           type="submit"
           className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
         >
           Sign Up
         </button>
       </form>
     </div>
   ); 
 }