import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "National Membership Registration & Validation Platform",
  description: "Enterprise hierarchical membership management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
