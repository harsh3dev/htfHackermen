import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Crypto Secure Network",
  description: "Secure transactions on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${inter.className} bg-gradient-to-b from-black via-violet-950 to-black text-white dark antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
