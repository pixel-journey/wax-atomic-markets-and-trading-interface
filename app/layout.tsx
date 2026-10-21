import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Sale preview — educational example',
  description: 'Filter fixture sales and preview a direct WAX purchase. Nothing is broadcast.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
