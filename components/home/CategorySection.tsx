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

interface CategoryGroup {
  name: string
  icon: string
  categoryCount: number
  companyCount: number
  categories: Category[]
}

const groupIcons: { [key: string]: string } = {
  '住宅内部': '🏠',
  '住宅外部': '🏗️',
  '設備・インフラ': '⚙️',
  'その他専門': '🔧',
}

const groupDescriptions: { [key: string]: string } = {
  '住宅内部': '内装・大工・建具など',
  '住宅外部': '外壁・塗装・屋根など',
  '設備・インフラ': '設備・電気・基礎など',
  'その他専門': '解体・補修・クリーニング',
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
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

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
        setCategories(mockCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // グループごとに集計
  const groups: CategoryGroup[] = Object.keys(groupIcons).map((groupName) => {
    const groupCategories = categories.filter((cat) => cat.group === groupName)
    const companyCount = groupCategories.reduce(
      (sum, cat) => sum + (cat._count?.companies || 0),
      0
    )
    return {
      name: groupName,
      icon: groupIcons[groupName],
      categoryCount: groupCategories.length,
      companyCount,
      categories: groupCategories,
    }
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name} className="border rounded-lg overflow-hidden">
          {/* グループヘッダー */}
          <button
            onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}
            className="w-full flex items-center justify-between p-6 bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{group.icon}</span>
              <div className="text-left">
                <h3 className="font-bold text-xl">{group.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.categoryCount}種類 • {group.companyCount}業者
                </p>
              </div>
            </div>
            <svg
              className={`w-6 h-6 transition-transform ${
                expandedGroup === group.name ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 展開コンテンツ */}
          {expandedGroup === group.name && (
            <div className="p-6 bg-muted/30 border-t">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {group.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/companies?category=${category.slug}`}
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm mb-1">{category.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {category._count?.companies || 0}業者
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
