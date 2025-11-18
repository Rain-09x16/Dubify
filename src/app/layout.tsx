import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dubify - Your Intelligent Dubai Tourism Companion",
  description:
    "AI-powered tourism companion for Dubai featuring intelligent chatbot, semantic search, safety alerts, and cultural guidance. Transform your Dubai experience with cutting-edge AI technology.",
  keywords: [
    "Dubai",
    "tourism",
    "AI",
    "travel guide",
    "chatbot",
    "safety",
    "cultural guide",
    "UAE",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-[#F9FAFB]`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
