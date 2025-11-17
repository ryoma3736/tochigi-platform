import { CompanyCard } from "@/components/customer/CompanyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data - will be replaced with actual database queries
const mockCompanies = [
  {
    id: "1",
    name: "株式会社 栃木建設",
    description: "栃木県内で30年以上の実績。住宅リフォームから大規模改修まで幅広く対応します。",
    category: "リフォーム",
    address: "栃木県宇都宮市本町1-1",
    phone: "028-123-4567",
    website: "https://example.com",
    instagramUrl: "https://instagram.com/tochigi_kensetsu",
    _count: { projects: 120 },
  },
  {
    id: "2",
    name: "日光造園サービス",
    description: "お庭のデザインから定期メンテナンスまで。自然と調和した美しい庭づくりを提案します。",
    category: "造園",
    address: "栃木県日光市今市本町5-10",
    phone: "0288-22-3456",
    website: null,
    instagramUrl: "https://instagram.com/nikko_zouen",
    _count: { projects: 85 },
  },
  {
    id: "3",
    name: "那須エクステリアデザイン",
    description: "外構工事のプロフェッショナル。カーポート、フェンス、門扉など、お住まいの顔づくりをお手伝い。",
    category: "外構",
    address: "栃木県那須塩原市本町3-20",
    phone: "0287-62-7890",
    website: "https://example.com/nasu",
    instagramUrl: null,
    _count: { projects: 65 },
  },
];

const categories = ["すべて", "リフォーム", "造園", "外構", "塗装", "水回り"];

export default async function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">業者を探す</h1>
          <p className="text-muted-foreground">
            栃木県内の信頼できる施工業者を見つけましょう
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="業者名、地域、サービスで検索..."
                className="w-full"
              />
            </div>
            <Button>検索</Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "すべて" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {mockCompanies.length}件の業者が見つかりました
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Pagination Placeholder */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline" disabled>前へ</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">次へ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
