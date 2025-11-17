'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "株式会社 栃木建設",
    category: "リフォーム",
    description: "栃木県内で30年以上の実績。住宅リフォームから大規模改修まで幅広く対応します。",
    address: "栃木県宇都宮市本町1-1",
    phone: "028-123-4567",
    email: "info@tochigi-kensetsu.example.com",
    website: "https://example.com",
    instagramUrl: "https://instagram.com/tochigi_kensetsu",
    businessHours: "平日 9:00-18:00、土曜 9:00-17:00",
    serviceArea: "栃木県全域、一部近隣県",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", formData);
    setIsEditing(false);
    alert("プロフィールを保存しました!(開発中)");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">プロフィール管理</h1>
          <p className="text-muted-foreground">
            顧客に表示される情報を管理します
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSubmit}>
                保存
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              編集する
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール完成度</CardTitle>
          <CardDescription>
            情報を充実させると、より多くの問い合わせを獲得できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>完成度</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }} />
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              <p className="font-medium mb-2">未入力の項目:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>施工実績の写真(0件)</li>
                <li>営業許可証番号</li>
                <li>従業員数</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>
              顧客が最初に見る重要な情報です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  業者名 <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  カテゴリー <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  disabled={!isEditing}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="リフォーム">リフォーム</option>
                  <option value="造園">造園</option>
                  <option value="外構">外構</option>
                  <option value="塗装">塗装</option>
                  <option value="水回り">水回り</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                紹介文 <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={!isEditing}
                required
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="あなたの会社の強みや特徴を記載してください"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length} / 500文字
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>連絡先情報</CardTitle>
            <CardDescription>
              顧客からの問い合わせに使用されます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  住所 <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  電話番号 <span className="text-destructive">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  メールアドレス <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  営業時間
                </label>
                <Input
                  value={formData.businessHours}
                  onChange={(e) => handleChange("businessHours", e.target.value)}
                  disabled={!isEditing}
                  placeholder="例: 平日 9:00-18:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ウェブサイト
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram URL
                </label>
                <Input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                対応エリア
              </label>
              <Input
                value={formData.serviceArea}
                onChange={(e) => handleChange("serviceArea", e.target.value)}
                disabled={!isEditing}
                placeholder="例: 栃木県全域"
              />
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              キャンセル
            </Button>
            <Button type="submit">
              変更を保存
            </Button>
          </div>
        )}
      </form>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>施工実績</CardTitle>
              <CardDescription>
                完了した施工事例を追加できます
              </CardDescription>
            </div>
            <Button>実績を追加</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>施工実績がまだ登録されていません</p>
            <p className="text-sm mt-1">実績を追加して、顧客にアピールしましょう</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
