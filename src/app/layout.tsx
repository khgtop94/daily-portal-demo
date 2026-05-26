import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Daily Portal — Live Demo (Case Study)",
  description:
    "Anonymized live demo of a 1-person full-stack enterprise portal. " +
    "3-tier session, 8-step permission model, approval state machine. " +
    "Built with Next.js 16 + Supabase patterns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
