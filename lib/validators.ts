import { z } from 'zod';

// 問い合わせフォームのバリデーション
export const inquirySchema = z.object({
  customerName: z.string().min(1, '名前を入力してください'),
  customerEmail: z.string().email('有効なメールアドレスを入力してください'),
  customerPhone: z.string().min(10, '有効な電話番号を入力してください'),
  message: z.string().min(10, 'メッセージは10文字以上入力してください'),
  selectedItems: z.array(z.string()).min(1, '少なくとも1つの業者を選択してください'),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// サービス作成/更新のバリデーション
export const serviceSchema = z.object({
  name: z.string().min(1, 'サービス名を入力してください'),
  description: z.string().min(10, '説明は10文字以上入力してください'),
  priceFrom: z.number().min(0, '価格は0以上である必要があります'),
  priceTo: z.number().min(0, '価格は0以上である必要があります').optional().nullable(),
  unit: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
}).refine(
  (data) => {
    if (data.priceTo !== null && data.priceTo !== undefined) {
      return data.priceFrom <= data.priceTo;
    }
    return true;
  },
  {
    message: '開始価格は終了価格以下である必要があります',
    path: ['priceFrom'],
  }
);

export type ServiceInput = z.infer<typeof serviceSchema>;

// 業者プロフィール更新のバリデーション
export const companyProfileSchema = z.object({
  name: z.string().min(1, '会社名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().min(10, '有効な電話番号を入力してください'),
  description: z.string().optional().nullable(),
  address: z.string().min(1, '住所を入力してください'),
  categoryId: z.string().min(1, 'カテゴリーを選択してください'),
  instagramHandle: z.string().optional().nullable(),
  instagramToken: z.string().optional().nullable(),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;

// 業者作成のバリデーション
export const createCompanySchema = companyProfileSchema.extend({
  subscriptionPlan: z.enum(['instagram_only', 'platform_full'], {
    message: '有効なサブスクリプションプランを選択してください',
  }),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

// カテゴリー作成のバリデーション
export const categorySchema = z.object({
  name: z.string().min(1, 'カテゴリー名を入力してください'),
  slug: z.string().min(1, 'スラッグを入力してください').regex(/^[a-z0-9-]+$/, 'スラッグは小文字、数字、ハイフンのみ使用できます'),
  description: z.string().optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// 問い合わせステータス更新のバリデーション
export const updateInquiryStatusSchema = z.object({
  status: z.enum(['sent', 'contacted', 'completed', 'cancelled'], {
    message: '有効なステータスを選択してください',
  }),
});

export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;

// クエリパラメータのバリデーション
export const companiesQuerySchema = z.object({
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CompaniesQuery = z.infer<typeof companiesQuerySchema>;

// サービス一覧クエリのバリデーション
export const servicesQuerySchema = z.object({
  isActive: z.string().optional().transform((val) => val === 'true'),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type ServicesQuery = z.infer<typeof servicesQuerySchema>;

// 問い合わせ一覧クエリのバリデーション
export const inquiriesQuerySchema = z.object({
  status: z.enum(['sent', 'contacted', 'completed', 'cancelled']).optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  sortBy: z.enum(['createdAt', 'updatedAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type InquiriesQuery = z.infer<typeof inquiriesQuerySchema>;
