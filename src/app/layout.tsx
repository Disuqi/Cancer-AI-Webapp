import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import { Toaster } from "react-hot-toast";
import {RecoilRoot} from "recoil";
import Root from "@/app/components/root";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cancer AI",
  description: "A website with a focus on cancer detection using AI",
  icons: 
  {
    icon: "poly_brain.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen min-w-screen bg-gray-900 text-white">
              <Root>{children}</Root>
          </main>
        </body>
      </html>
  );
}
