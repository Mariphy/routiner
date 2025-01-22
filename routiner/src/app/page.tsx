"use client";
import Board from "./components/Board";
import Calendar from "./components/Calendar";
import Day from "./components/Day";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <h1 className="text-2xl">Routiner App</h1>
        <div className="mt-4">
          <Link href="/board"> Board </Link>
          <Link href="/calendar"> Calendar </Link>
        </div>
      </header>
      <main className="flex-grow p-4">
        <Board />
      </main>
    </div>
  );
  }