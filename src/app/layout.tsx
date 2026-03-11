import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STAR Real Estate Agency",
  description: "Rental request form for international tenants in Debrecen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
