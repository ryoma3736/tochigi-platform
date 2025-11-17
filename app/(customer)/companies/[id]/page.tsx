import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstagramGallery } from "@/components/customer/InstagramGallery";

// Mock data - will be replaced with actual database queries
const mockCompanyDetails = {
  "1": {
    id: "1",
    name: "株式会社 栃木建設",
    description: "栃木県内で30年以上の実績。住宅リフォームから大規模改修まで幅広く対応します。お客様のご要望に寄り添い、満足度の高い施工を心がけています。",
    category: "リフォーム",
    address: "栃木県宇都宮市本町1-1",
    phone: "028-123-4567",
    email: "info@tochigi-kensetsu.example.com",
    website: "https://example.com",
    instagramUrl: "https://instagram.com/tochigi_kensetsu",
    businessHours: "平日 9:00-18:00、土曜 9:00-17:00",
    yearEstablished: 1990,
    employeeCount: 25,
    licenses: ["建設業許可 栃木県知事許可(般-30)第12345号", "一級建築士事務所登録"],
    serviceArea: "栃木県全域、一部近隣県",
    specialties: ["住宅リフォーム", "店舗改装", "耐震補強", "バリアフリー化"],
    projects: [
      {
        id: "p1",
        title: "宇都宮市K様邸 全面リフォーム",
        description: "築40年の戸建て住宅を全面リフォーム。間取り変更と水回り一新。",
        completedAt: "2024-02",
        imageUrl: null,
      },
      {
        id: "p2",
        title: "日光市T様邸 キッチン改修",
        description: "最新システムキッチンへの交換とダイニング空間の拡張。",
        completedAt: "2024-01",
        imageUrl: null,
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const company = mockCompanyDetails[id as keyof typeof mockCompanyDetails];

  if (!company) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {company.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
            <p className="text-lg text-muted-foreground">{company.description}</p>
          </div>
          <div className="flex gap-2">
            <Button size="lg" className="flex-1 md:flex-none">
              問い合わせる
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">所在地</dt>
                <dd className="text-sm">{company.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">電話番号</dt>
                <dd className="text-sm">{company.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">メールアドレス</dt>
                <dd className="text-sm">{company.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">営業時間</dt>
                <dd className="text-sm">{company.businessHours}</dd>
              </div>
              {company.website && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">ウェブサイト</dt>
                  <dd className="text-sm">
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {company.website}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">対応エリア</dt>
                <dd className="text-sm">{company.serviceArea}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>会社概要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">創業年</dt>
                <dd className="text-sm">{company.yearEstablished}年</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">従業員数</dt>
                <dd className="text-sm">{company.employeeCount}名</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">保有資格・許可</dt>
                <dd className="text-sm space-y-1">
                  {company.licenses.map((license, idx) => (
                    <div key={idx}>{license}</div>
                  ))}
                </dd>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>得意分野</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>施工実績</CardTitle>
            <CardDescription>最近の主な施工事例をご紹介します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {company.projects.map((project) => (
                <div key={project.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{project.title}</h4>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                      {project.completedAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instagram Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>施工事例ギャラリー</CardTitle>
            <CardDescription>Instagram で最新の施工事例をチェック</CardDescription>
          </CardHeader>
          <CardContent>
            <InstagramGallery instagramUrl={company.instagramUrl} />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">お見積もり・ご相談はお気軽に</h3>
              <p className="text-muted-foreground">
                経験豊富なスタッフが、あなたのご要望にお応えします
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg">問い合わせフォームへ</Button>
                <Button size="lg" variant="outline">電話で問い合わせる</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
