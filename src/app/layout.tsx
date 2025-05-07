import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synced Music Player",
  description: "A synchronized music player for two people",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-900 via-gray-900 to-black min-h-screen text-white`}>
        {children}
      </body>
    </html>
  );
}
