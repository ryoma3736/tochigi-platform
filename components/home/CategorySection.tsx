'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

interface Category {
  id: string
  name: string
  slug: string
  group: string | null
  _count?: {
    companies: number
  }
}

const groupIcons: { [key: string]: string } = {
  '住宅内部': '🏠',
  '住宅外部': '🏗️',
  '設備・インフラ': '⚙️',
  'その他専門': '🔧',
}

// モックデータ（データベース未接続時のフォールバック）
const mockCategories: Category[] = [
  { id: '1', name: '内装工事', slug: 'interior-work', group: '住宅内部', _count: { companies: 5 } },
  { id: '2', name: '大工工事', slug: 'carpentry-work', group: '住宅内部', _count: { companies: 8 } },
  { id: '3', name: '建具工事', slug: 'joinery-work', group: '住宅内部', _count: { companies: 3 } },
  { id: '4', name: '家具工事', slug: 'furniture-work', group: '住宅内部', _count: { companies: 4 } },
  { id: '5', name: 'インテリア工事', slug: 'interior-design-work', group: '住宅内部', _count: { companies: 6 } },
  { id: '6', name: 'ガラス工事', slug: 'glass-work', group: '住宅内部', _count: { companies: 2 } },
  { id: '7', name: '外壁工事', slug: 'exterior-wall-work', group: '住宅外部', _count: { companies: 7 } },
  { id: '8', name: '塗装工事', slug: 'painting-work', group: '住宅外部', _count: { companies: 12 } },
  { id: '9', name: '屋根工事', slug: 'roofing-work', group: '住宅外部', _count: { companies: 9 } },
  { id: '10', name: '防水工事', slug: 'waterproofing-work', group: '住宅外部', _count: { companies: 5 } },
  { id: '11', name: '外構工事', slug: 'exterior-work', group: '住宅外部', _count: { companies: 10 } },
  { id: '12', name: '設備工事', slug: 'equipment-work', group: '設備・インフラ', _count: { companies: 8 } },
  { id: '13', name: '電気工事', slug: 'electrical-work', group: '設備・インフラ', _count: { companies: 11 } },
  { id: '14', name: '基礎工事', slug: 'foundation-work', group: '設備・インフラ', _count: { companies: 4 } },
  { id: '15', name: '土木工事', slug: 'civil-engineering-work', group: '設備・インフラ', _count: { companies: 6 } },
  { id: '16', name: '解体工事', slug: 'demolition-work', group: 'その他専門', _count: { companies: 5 } },
  { id: '17', name: '補修工事', slug: 'repair-work', group: 'その他専門', _count: { companies: 7 } },
  { id: '18', name: 'クリーニング工事', slug: 'cleaning-work', group: 'その他専門', _count: { companies: 9 } },
]

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?includeCount=true')
        const data = await response.json()

        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch categories, using mock data:', error)
        // モックデータを使用
        setCategories(mockCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const icon = category.group ? groupIcons[category.group] : '📁'
        return (
          <Link
            key={category.id}
            href={`/companies?category=${category.slug}`}
            className="group"
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div className="font-semibold mb-1 text-sm">{category.name}</div>
                <div className="text-xs text-muted-foreground">
                  {category._count?.companies || 0}業者
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
