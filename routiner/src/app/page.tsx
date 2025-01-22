"use client";
import Board from "./components/Board";
import NavBar from "./components/NavBar";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <NavBar/>
      </header>
      <main className="flex-grow p-4">
        
      </main>
    </div>
  );
}