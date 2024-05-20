import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Challenges App",
  description: "Track and complete personal challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} data-theme="corporate">
        <PlausibleProvider
          trackLocalhost={true}
          domain="challengesapp.vercel.app"
        >
          <Navbar />
          {children}
        </PlausibleProvider>
      </body>
    </html>
  );
}
