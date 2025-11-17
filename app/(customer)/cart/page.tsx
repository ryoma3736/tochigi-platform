'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: string;
  companyId: string;
  companyName: string;
  category: string;
  message: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      companyId: "1",
      companyName: "株式会社 栃木建設",
      category: "リフォーム",
      message: "",
    },
    {
      id: "2",
      companyId: "2",
      companyName: "日光造園サービス",
      category: "造園",
      message: "",
    },
  ]);

  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredDate: "",
  });

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateMessage = (id: string, message: string) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, message } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting inquiry:", { contactInfo, cartItems });
    alert("問い合わせを送信しました!(開発中)");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">問い合わせカート</h1>
          <p className="text-muted-foreground">
            選択した業者へまとめて問い合わせができます
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">カートが空です</h3>
              <p className="text-muted-foreground mb-6">
                業者一覧から問い合わせたい業者を追加してください
              </p>
              <Button asChild>
                <a href="/companies">業者を探す</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>選択中の業者 ({cartItems.length}件)</CardTitle>
                <CardDescription>
                  各業者への個別メッセージを入力できます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.companyName}</h3>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mt-1">
                          {item.category}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        削除
                      </Button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        この業者へのメッセージ (任意)
                      </label>
                      <textarea
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="例: キッチンリフォームの見積もりをお願いします"
                        value={item.message}
                        onChange={(e) => updateMessage(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>お客様情報</CardTitle>
                <CardDescription>
                  業者からの返信に必要な情報をご入力ください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      お名前 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder="山田 太郎"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      メールアドレス <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="example@example.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      電話番号 <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="090-1234-5678"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
                      希望連絡日時 (任意)
                    </label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={contactInfo.preferredDate}
                      onChange={(e) => setContactInfo({ ...contactInfo, preferredDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    施工希望住所 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="address"
                    required
                    placeholder="栃木県宇都宮市..."
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>問い合わせ送信後の流れ:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>各業者に一括で問い合わせが送信されます</li>
                      <li>業者から個別に返信が届きます(メールまたは電話)</li>
                      <li>複数の見積もりを比較検討できます</li>
                    </ol>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" size="lg" className="flex-1">
                      {cartItems.length}件の業者に問い合わせる
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      asChild
                    >
                      <a href="/companies">業者を追加</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}
