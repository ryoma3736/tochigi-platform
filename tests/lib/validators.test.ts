import { describe, it, expect } from 'vitest';
import {
  inquirySchema,
  serviceSchema,
  companyProfileSchema,
  createCompanySchema,
  categorySchema,
  updateInquiryStatusSchema,
  companiesQuerySchema,
  servicesQuerySchema,
  inquiriesQuerySchema,
} from '@/lib/validators';

describe('inquirySchema', () => {
  it('有効な問い合わせデータを検証できる', () => {
    const validData = {
      customerName: '田中太郎',
      customerEmail: 'tanaka@example.com',
      customerPhone: '090-1234-5678',
      message: 'リフォームについて問い合わせたいです。',
      selectedItems: ['company1', 'company2'],
    };

    const result = inquirySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('名前が空の場合はエラーになる', () => {
    const invalidData = {
      customerName: '',
      customerEmail: 'test@example.com',
      customerPhone: '090-1234-5678',
      message: 'テストメッセージです。',
      selectedItems: ['company1'],
    };

    const result = inquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('名前を入力してください');
    }
  });

  it('無効なメールアドレスはエラーになる', () => {
    const invalidData = {
      customerName: '田中太郎',
      customerEmail: 'invalid-email',
      customerPhone: '090-1234-5678',
      message: 'テストメッセージです。',
      selectedItems: ['company1'],
    };

    const result = inquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('メッセージが10文字未満の場合はエラーになる', () => {
    const invalidData = {
      customerName: '田中太郎',
      customerEmail: 'test@example.com',
      customerPhone: '090-1234-5678',
      message: '短い',
      selectedItems: ['company1'],
    };

    const result = inquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('メッセージは10文字以上入力してください');
    }
  });

  it('業者が選択されていない場合はエラーになる', () => {
    const invalidData = {
      customerName: '田中太郎',
      customerEmail: 'test@example.com',
      customerPhone: '090-1234-5678',
      message: 'テストメッセージです。',
      selectedItems: [],
    };

    const result = inquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('serviceSchema', () => {
  it('有効なサービスデータを検証できる', () => {
    const validData = {
      name: 'キッチンリフォーム',
      description: '最新設備を使用したキッチンリフォームサービスです。',
      priceFrom: 100000,
      priceTo: 500000,
      unit: '件',
      isActive: true,
    };

    const result = serviceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('価格の範囲が逆転している場合はエラーになる', () => {
    const invalidData = {
      name: 'サービス',
      description: 'サービスの説明です。',
      priceFrom: 500000,
      priceTo: 100000,
      unit: '件',
    };

    const result = serviceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('開始価格は終了価格以下である必要があります');
    }
  });

  it('価格が負の値の場合はエラーになる', () => {
    const invalidData = {
      name: 'サービス',
      description: 'サービスの説明です。',
      priceFrom: -100,
    };

    const result = serviceSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('終了価格がnullの場合は検証をパスする', () => {
    const validData = {
      name: 'サービス',
      description: 'サービスの説明です。',
      priceFrom: 10000,
      priceTo: null,
    };

    const result = serviceSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('companyProfileSchema', () => {
  it('有効な業者プロフィールデータを検証できる', () => {
    const validData = {
      name: 'テスト株式会社',
      email: 'info@test.com',
      phone: '028-1234-5678',
      description: '業者の説明です',
      address: '栃木県宇都宮市',
      categoryId: 'category-id',
      instagramHandle: '@test_company',
      instagramToken: 'token123',
    };

    const result = companyProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('メールアドレスが無効な場合はエラーになる', () => {
    const invalidData = {
      name: 'テスト株式会社',
      email: 'invalid-email',
      phone: '028-1234-5678',
      address: '栃木県宇都宮市',
      categoryId: 'category-id',
    };

    const result = companyProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('電話番号が短すぎる場合はエラーになる', () => {
    const invalidData = {
      name: 'テスト株式会社',
      email: 'info@test.com',
      phone: '123',
      address: '栃木県宇都宮市',
      categoryId: 'category-id',
    };

    const result = companyProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('createCompanySchema', () => {
  it('有効な業者作成データを検証できる', () => {
    const validData = {
      name: 'テスト株式会社',
      email: 'info@test.com',
      phone: '028-1234-5678',
      address: '栃木県宇都宮市',
      categoryId: 'category-id',
      subscriptionPlan: 'instagram_only' as const,
    };

    const result = createCompanySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('無効なサブスクリプションプランはエラーになる', () => {
    const invalidData = {
      name: 'テスト株式会社',
      email: 'info@test.com',
      phone: '028-1234-5678',
      address: '栃木県宇都宮市',
      categoryId: 'category-id',
      subscriptionPlan: 'invalid_plan',
    };

    const result = createCompanySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('categorySchema', () => {
  it('有効なカテゴリーデータを検証できる', () => {
    const validData = {
      name: 'リフォーム',
      slug: 'reform',
      description: 'リフォーム業者',
    };

    const result = categorySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('無効なスラッグはエラーになる', () => {
    const invalidData = {
      name: 'リフォーム',
      slug: 'Reform_123',
      description: 'リフォーム業者',
    };

    const result = categorySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('スラッグは小文字、数字、ハイフンのみ使用できます');
    }
  });
});

describe('updateInquiryStatusSchema', () => {
  it('有効なステータス更新データを検証できる', () => {
    const validData = { status: 'contacted' as const };
    const result = updateInquiryStatusSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('無効なステータスはエラーになる', () => {
    const invalidData = { status: 'invalid_status' };
    const result = updateInquiryStatusSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('companiesQuerySchema', () => {
  it('有効なクエリパラメータを検証できる', () => {
    const validData = {
      categoryId: 'cat1',
      search: 'テスト',
      page: '2',
      limit: '20',
      sortBy: 'name' as const,
      order: 'asc' as const,
    };

    const result = companiesQuerySchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it('ページ番号が文字列から数値に変換される', () => {
    const data = {
      page: '5',
      limit: '15',
    };

    const result = companiesQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.page).toBe('number');
      expect(typeof result.data.limit).toBe('number');
      expect(result.data.page).toBe(5);
      expect(result.data.limit).toBe(15);
    }
  });

  it('デフォルト値が適用される', () => {
    const result = companiesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.data.sortBy).toBe('createdAt');
      expect(result.data.order).toBe('desc');
    }
  });
});

describe('servicesQuerySchema', () => {
  it('isActiveが文字列からbooleanに変換される', () => {
    const data = { isActive: 'true' };
    const result = servicesQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.isActive).toBe('boolean');
      expect(result.data.isActive).toBe(true);
    }
  });

  it('isActiveがfalseに変換される', () => {
    const data = { isActive: 'false' };
    const result = servicesQuerySchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });
});

describe('inquiriesQuerySchema', () => {
  it('有効な問い合わせクエリを検証できる', () => {
    const validData = {
      status: 'contacted' as const,
      page: '1',
      limit: '10',
      sortBy: 'createdAt' as const,
      order: 'desc' as const,
    };

    const result = inquiriesQuerySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('デフォルト値が適用される', () => {
    const result = inquiriesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortBy).toBe('createdAt');
      expect(result.data.order).toBe('desc');
    }
  });
});
