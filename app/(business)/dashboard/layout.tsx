import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">栃木プラットフォーム</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm flex-1">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              ダッシュボード
            </Link>
            <Link
              href="/dashboard/inquiries"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              問い合わせ
            </Link>
            <Link
              href="/dashboard/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              プロフィール
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/companies">顧客ページを見る</Link>
            </Button>
            <Button variant="outline" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
