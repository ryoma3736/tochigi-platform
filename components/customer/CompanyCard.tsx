'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    instagramUrl: string | null;
    _count?: {
      projects: number;
    };
  };
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{company.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {company.description || "説明がありません"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {company.category}
            </span>
          </div>
          {company.address && (
            <p className="text-muted-foreground flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company.address}
            </p>
          )}
          {company._count && company._count.projects > 0 && (
            <p className="text-muted-foreground">
              施工実績: {company._count.projects}件
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link href={`/companies/${company.id}`} className="flex-1">
          <Button className="w-full" variant="outline">
            詳細を見る
          </Button>
        </Link>
        <Button className="flex-1">
          問い合わせる
        </Button>
      </CardFooter>
    </Card>
  );
}
