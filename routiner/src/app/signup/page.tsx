"use client";
 
 import { useRouter } from "next/navigation";
 import { useState } from "react";
 import { signup } from "@/app/actions/auth";
 
 export default function SignUpPage() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
 
   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setError("");

      try {
          const formData = new FormData();
          formData.append("email", email);
          formData.append("password", password);

          await signup(formData);
          router.push("/api/auth/signin"); // Redirect to login after successful signup
      } catch (err: any) {
          setError(err.message); // Display validation or API error
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
         {error && <p className="text-red-500 mb-4">{error}</p>}
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