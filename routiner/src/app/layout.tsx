import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { ThemeModeScript } from 'flowbite-react';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Routiner",
  description: "Created by Mariphy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
          <ThemeModeScript />
       </head>
       <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="fixed top-0 left-0 w-full z-50">
            <NavBar /> 
          </header>
          <main className="flex-grow pt-30">{children}</main> {/* Add padding to account for the fixed NavBar */}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
