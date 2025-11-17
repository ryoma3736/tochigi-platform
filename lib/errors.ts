import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// カスタムエラークラス
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// よく使うエラー
export class NotFoundError extends ApiError {
  constructor(resource: string = 'リソース') {
    super(404, `${resource}が見つかりません`, 'NOT_FOUND');
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = '不正なリクエストです') {
    super(400, message, 'BAD_REQUEST');
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = '認証が必要です') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'アクセスが拒否されました') {
    super(403, message, 'FORBIDDEN');
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = '既に存在します') {
    super(409, message, 'CONFLICT');
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'サーバーエラーが発生しました') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}

// エラーレスポンスの型
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Zodバリデーションエラーをフォーマット
export function formatZodError(error: ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });

  return formattedErrors;
}

// エラーハンドラー - NextResponseを返す
export function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);

  // Zodバリデーションエラー
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'バリデーションエラー',
          code: 'VALIDATION_ERROR',
          details: formatZodError(error),
        },
      },
      { status: 400 }
    );
  }

  // カスタムAPIエラー
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    );
  }

  // Prismaエラー
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any };

    // ユニーク制約違反
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.[0] || 'フィールド';
      return NextResponse.json(
        {
          error: {
            message: `この${target}は既に使用されています`,
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
          },
        },
        { status: 409 }
      );
    }

    // レコードが見つからない
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: {
            message: 'レコードが見つかりません',
            code: 'NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    // 外部キー制約違反
    if (prismaError.code === 'P2003') {
      return NextResponse.json(
        {
          error: {
            message: '関連するレコードが見つかりません',
            code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
          },
        },
        { status: 400 }
      );
    }
  }

  // その他のエラー
  return NextResponse.json(
    {
      error: {
        message: 'サーバーエラーが発生しました',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status: 500 }
  );
}

// 成功レスポンスヘルパー
export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

// ページネーションレスポンスの型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ページネーション付きレスポンスヘルパー
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
