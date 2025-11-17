import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // Mock data - will be replaced with actual database queries
  const stats = {
    totalInquiries: 42,
    newInquiries: 8,
    activeProjects: 15,
    completedProjects: 120,
    monthlyViews: 856,
    profileCompletion: 85,
  };

  const recentInquiries = [
    {
      id: "1",
      customerName: "田中 花子",
      createdAt: "2024-11-15",
      message: "キッチンリフォームの見積もりをお願いします",
    },
    {
      id: "2",
      customerName: "佐藤 次郎",
      createdAt: "2024-11-14",
      message: "外壁塗装について相談させてください",
    },
    {
      id: "3",
      customerName: "鈴木 三郎",
      createdAt: "2024-11-13",
      message: "バリアフリー化のリフォームについて",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">ダッシュボード</h1>
        <p className="text-muted-foreground">
          業務状況の概要を確認できます
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>新規問い合わせ</CardDescription>
            <CardTitle className="text-4xl">{stats.newInquiries}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              対応が必要な問い合わせ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>総問い合わせ数</CardDescription>
            <CardTitle className="text-4xl">{stats.totalInquiries}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              これまでの累計
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>進行中の案件</CardDescription>
            <CardTitle className="text-4xl">{stats.activeProjects}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              現在対応中の案件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>完了実績</CardDescription>
            <CardTitle className="text-4xl">{stats.completedProjects}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              施工完了した案件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>月間閲覧数</CardDescription>
            <CardTitle className="text-4xl">{stats.monthlyViews}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              今月のプロフィール閲覧
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>プロフィール完成度</CardDescription>
            <CardTitle className="text-4xl">{stats.profileCompletion}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              情報の充実度
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近の問い合わせ</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/inquiries">すべて見る</a>
              </Button>
            </div>
            <CardDescription>
              新しい問い合わせが{stats.newInquiries}件あります
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{inquiry.customerName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="ml-4">
                    確認
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>
              よく使う機能へのショートカット
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/dashboard/profile">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                プロフィールを編集
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <a href="/dashboard/inquiries">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                問い合わせを確認
              </a>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              施工実績を追加
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              統計を確認
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion Notice */}
      {stats.profileCompletion < 100 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">
                  プロフィールを完成させましょう
                </h3>
                <p className="text-sm text-muted-foreground">
                  プロフィール情報を充実させると、より多くの問い合わせを獲得できます。
                  現在の完成度: {stats.profileCompletion}%
                </p>
              </div>
              <Button asChild>
                <a href="/dashboard/profile">プロフィール編集</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
