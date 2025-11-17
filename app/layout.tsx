import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "栃木プラットフォーム",
  description: "栃木県の地域活性化プラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">栃木プラットフォーム</h1>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 栃木プラットフォーム. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
