import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InstagramFeedClient } from "@/components/home/InstagramFeedClient";
import { CategorySection } from "@/components/home/CategorySection";
import Link from "next/link";

export default function HomePage() {

  const features = [
    {
      title: "複数業者に一括問い合わせ",
      description: "気になる業者をカートに追加して、まとめて見積もり依頼ができます。",
      icon: "📋",
    },
    {
      title: "Instagram連携で施工例確認",
      description: "業者の最新施工事例をInstagramで簡単にチェックできます。",
      icon: "📸",
    },
    {
      title: "地域密着の信頼できる業者",
      description: "栃木県内の実績ある業者のみを厳選して掲載しています。",
      icon: "⭐",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          栃木の住まいづくりを<br />もっと簡単に
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          リフォーム、造園、外構工事など、信頼できる施工業者を見つけて
          <br />
          複数社に一括で見積もり依頼ができるプラットフォーム
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/companies">業者を探す</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">業者の方はこちら</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            選ばれる理由
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            カテゴリーから探す
          </h2>
          <CategorySection />
        </div>
      </section>

      {/* Instagram Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              注目の企業Instagram
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              栃木県内の企業が発信する最新情報をInstagramでチェック。
              施工事例や日々の様子をご覧いただけます。
            </p>
          </div>
          <InstagramFeedClient limit={9} useEmbeds={false} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50 -mx-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ご利用の流れ
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "業者を探す",
                description: "カテゴリーや地域から、希望に合う施工業者を検索します。",
              },
              {
                step: "2",
                title: "カートに追加",
                description: "気になる業者を複数選んで、問い合わせカートに追加します。",
              },
              {
                step: "3",
                title: "一括問い合わせ",
                description: "必要事項を入力して、選んだ業者すべてに一括で見積もり依頼を送信。",
              },
              {
                step: "4",
                title: "見積もり比較",
                description: "各業者から届いた見積もりを比較して、最適な業者を選びます。",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            まずは業者を探してみましょう
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            栃木県内の信頼できる施工業者が、あなたのご要望をお待ちしています
          </p>
          <Button size="lg" asChild>
            <Link href="/companies">業者一覧を見る</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
