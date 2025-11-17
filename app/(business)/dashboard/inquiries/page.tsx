import { InquiryList } from "@/components/business/InquiryList";

// Mock data - will be replaced with actual database queries
const mockInquiries = [
  {
    id: "1",
    customerName: "田中 花子",
    customerEmail: "hanako@example.com",
    customerPhone: "090-1234-5678",
    message: "キッチンリフォームの見積もりをお願いします。システムキッチンへの交換を検討しています。",
    status: "new" as const,
    createdAt: "2024-11-15T10:30:00",
    preferredDate: "2024-11-20",
    address: "栃木県宇都宮市本町2-5-10",
  },
  {
    id: "2",
    customerName: "佐藤 次郎",
    customerEmail: "jiro@example.com",
    customerPhone: "090-2345-6789",
    message: "外壁塗装について相談させてください。築15年の木造住宅です。",
    status: "new" as const,
    createdAt: "2024-11-14T14:20:00",
    address: "栃木県宇都宮市駅前通り1-2-3",
  },
  {
    id: "3",
    customerName: "鈴木 三郎",
    customerEmail: "saburo@example.com",
    customerPhone: "090-3456-7890",
    message: "バリアフリー化のリフォームについて。手すりの設置と段差解消を希望します。",
    status: "contacted" as const,
    createdAt: "2024-11-13T09:15:00",
    preferredDate: "2024-11-18",
    address: "栃木県日光市今市本町4-8",
  },
  {
    id: "4",
    customerName: "高橋 四郎",
    customerEmail: "shiro@example.com",
    customerPhone: "090-4567-8901",
    message: "浴室のリフォームを考えています。ユニットバスへの交換希望です。",
    status: "contacted" as const,
    createdAt: "2024-11-12T16:45:00",
    address: "栃木県小山市中央町3-7-1",
  },
  {
    id: "5",
    customerName: "伊藤 五郎",
    customerEmail: "goro@example.com",
    customerPhone: "090-5678-9012",
    message: "和室を洋室にリフォームしたいです。見積もりをお願いします。",
    status: "completed" as const,
    createdAt: "2024-11-10T11:30:00",
    address: "栃木県栃木市大通り2-4-6",
  },
  {
    id: "6",
    customerName: "渡辺 六子",
    customerEmail: "rokuko@example.com",
    customerPhone: "090-6789-0123",
    message: "リビングの床材張り替えについて相談したいです。",
    status: "completed" as const,
    createdAt: "2024-11-08T13:20:00",
    address: "栃木県那須塩原市本町5-3-2",
  },
];

export default function InquiriesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">問い合わせ管理</h1>
        <p className="text-muted-foreground">
          顧客からの問い合わせを確認・管理できます
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-800 mb-1">未対応</div>
          <div className="text-2xl font-bold text-yellow-900">
            {mockInquiries.filter((i) => i.status === "new").length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800 mb-1">対応中</div>
          <div className="text-2xl font-bold text-blue-900">
            {mockInquiries.filter((i) => i.status === "contacted").length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-800 mb-1">完了</div>
          <div className="text-2xl font-bold text-green-900">
            {mockInquiries.filter((i) => i.status === "completed").length}
          </div>
        </div>
      </div>

      {/* Inquiry List */}
      <InquiryList inquiries={mockInquiries} />
    </div>
  );
}
