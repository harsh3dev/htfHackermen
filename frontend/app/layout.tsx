import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google'


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
    <html lang="en">
      <body
        className={`${inter.className} dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
