import "./globals.css";
import { Manrope, Newsreader } from "next/font/google";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = { title: "Ajaia Docs", description: "Lightweight collaborative documents" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
