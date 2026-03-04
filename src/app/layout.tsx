import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fuc6kbq.css" />
      </head>
      <body
        className="font-display antialiased bg-[#0a0a0a] text-slate-100"
        suppressHydrationWarning
      >
        <FocusProvider>{children}</FocusProvider>
      </body>
    </html>
  );
}
