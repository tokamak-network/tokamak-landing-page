import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tokamak Network",
  description: "Tailored Ethereum Solution",
  icons: {
    icon: [
      {
        url: "/tokamak_favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-proxima">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fuc6kbq.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FocusProvider>{children}</FocusProvider>
      </body>
    </html>
  );
}
