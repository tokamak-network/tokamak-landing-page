import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body
        className={`${manrope.variable} font-display antialiased bg-[#0a0a0a] text-slate-100`}
        suppressHydrationWarning
      >
        <FocusProvider>{children}</FocusProvider>
      </body>
    </html>
  );
}
