'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: "new" | "contacted" | "completed";
  createdAt: string;
  preferredDate?: string;
  address: string;
}

interface InquiryListProps {
  inquiries: Inquiry[];
}

export function InquiryList({ inquiries }: InquiryListProps) {
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "completed">("all");

  const filteredInquiries = inquiries.filter(
    (inquiry) => filter === "all" || inquiry.status === filter
  );

  const statusLabels = {
    new: "未対応",
    contacted: "対応中",
    completed: "完了",
  };

  const statusColors = {
    new: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
  };

  const updateStatus = (id: string, newStatus: Inquiry["status"]) => {
    console.log("Update inquiry", id, "to", newStatus);
    // This would be an API call in production
  };

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          すべて ({inquiries.length})
        </Button>
        <Button
          variant={filter === "new" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("new")}
        >
          未対応 ({inquiries.filter((i) => i.status === "new").length})
        </Button>
        <Button
          variant={filter === "contacted" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("contacted")}
        >
          対応中 ({inquiries.filter((i) => i.status === "contacted").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          完了 ({inquiries.filter((i) => i.status === "completed").length})
        </Button>
      </div>

      {/* Inquiry Cards */}
      {filteredInquiries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {filter === "all" ? "問い合わせがありません" : `${statusLabels[filter]}の問い合わせがありません`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{inquiry.customerName}</CardTitle>
                    <CardDescription>
                      {new Date(inquiry.createdAt).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColors[inquiry.status]}`}
                  >
                    {statusLabels[inquiry.status]}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1">メールアドレス</dt>
                    <dd>
                      <a href={`mailto:${inquiry.customerEmail}`} className="text-primary hover:underline">
                        {inquiry.customerEmail}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1">電話番号</dt>
                    <dd>
                      <a href={`tel:${inquiry.customerPhone}`} className="text-primary hover:underline">
                        {inquiry.customerPhone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1">施工希望住所</dt>
                    <dd>{inquiry.address}</dd>
                  </div>
                  {inquiry.preferredDate && (
                    <div>
                      <dt className="font-medium text-muted-foreground mb-1">希望連絡日</dt>
                      <dd>{new Date(inquiry.preferredDate).toLocaleDateString("ja-JP")}</dd>
                    </div>
                  )}
                </div>

                {inquiry.message && (
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1 text-sm">メッセージ</dt>
                    <dd className="bg-muted/50 rounded-md p-3 text-sm whitespace-pre-wrap">
                      {inquiry.message}
                    </dd>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {inquiry.status === "new" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(inquiry.id, "contacted")}
                    >
                      対応中にする
                    </Button>
                  )}
                  {inquiry.status === "contacted" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(inquiry.id, "completed")}
                    >
                      完了にする
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={`mailto:${inquiry.customerEmail}`}>メールで返信</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={`tel:${inquiry.customerPhone}`}>電話する</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
