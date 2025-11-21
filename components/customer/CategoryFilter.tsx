'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  group: string | null
  _count?: {
    companies: number
  }
}

interface GroupedCategories {
  [group: string]: Category[]
}

interface CategoryFilterProps {
  onCategoryChange?: (categoryId: string | null) => void
  selectedCategoryId?: string | null
}

export function CategoryFilter({ onCategoryChange, selectedCategoryId }: CategoryFilterProps) {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>({})
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?groupBy=true&includeCount=true')
      const data = await response.json()

      if (data.success) {
        setGroupedCategories(data.data.grouped)
        setAllCategories(data.data.all)
        // デフォルトで全グループを展開
        setExpandedGroups(new Set(Object.keys(data.data.grouped)))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleGroup = (group: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(group)) {
      newExpanded.delete(group)
    } else {
      newExpanded.add(group)
    }
    setExpandedGroups(newExpanded)
  }

  const handleCategoryClick = (categoryId: string | null) => {
    onCategoryChange?.(categoryId)
  }

  const groupIcons: { [key: string]: string } = {
    '住宅内部': '🏠',
    '住宅外部': '🏗️',
    '設備・インフラ': '⚙️',
    'その他専門': '🔧',
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* すべてボタン */}
      <Button
        variant={selectedCategoryId === null ? 'default' : 'outline'}
        className="w-full justify-start"
        onClick={() => handleCategoryClick(null)}
      >
        すべてのカテゴリー ({allCategories.length})
      </Button>

      {/* グループ別カテゴリー */}
      {Object.entries(groupedCategories).map(([group, categories]) => (
        <div key={group} className="space-y-2">
          <button
            onClick={() => toggleGroup(group)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="font-semibold flex items-center gap-2">
              <span className="text-xl">{groupIcons[group] || '📁'}</span>
              {group}
            </span>
            {expandedGroups.has(group) ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedGroups.has(group) && (
            <div className="ml-4 space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                  {category._count?.companies !== undefined && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      ({category._count.companies})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
