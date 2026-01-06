import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"; // <--- The only new import needed
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Midnight OS",
  description: "Personal Life Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. Wrap the entire app in ClerkProvider
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-zinc-950 text-zinc-200 min-h-screen antialiased">

          {/* 2. Keep your existing Sidebar */}
          <Sidebar />

          {/* 3. Keep your existing Layout Structure */}
          <div className="pl-16 transition-all duration-300">
            <main className="max-w-7xl mx-auto p-6 md:p-8">
              {children}
            </main>
          </div>

        </body>
      </html>
    </ClerkProvider>
  );
}
