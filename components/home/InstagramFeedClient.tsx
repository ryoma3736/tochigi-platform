'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { InstagramEmbed } from './InstagramEmbed'

interface InstagramPost {
  id: string
  postId: string
  caption: string | null
  mediaUrl: string
  mediaType: string
  permalink: string
  timestamp: string
  likesCount: number
  commentsCount: number
  company: {
    id: string
    name: string
    instagramHandle: string | null
    category: {
      name: string
      slug: string
    }
  }
}

interface InstagramFeedClientProps {
  limit?: number
  useEmbeds?: boolean
}

// モックデータ（データベース未接続時）
const mockPosts: InstagramPost[] = [
  {
    id: '1',
    postId: 'mock_1',
    caption: '内装リフォーム完成しました！お客様に喜んでいただけて嬉しいです。 #内装工事 #リフォーム #栃木',
    mediaUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_1',
    timestamp: new Date().toISOString(),
    likesCount: 120,
    commentsCount: 8,
    company: {
      id: '1',
      name: '栃木内装工房',
      instagramHandle: 'tochigi_naisou',
      category: { name: '内装工事', slug: 'interior-work' }
    }
  },
  {
    id: '2',
    postId: 'mock_2',
    caption: '外壁塗装工事の施工事例です。美しい仕上がりになりました！ #外壁塗装 #塗装工事',
    mediaUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_2',
    timestamp: new Date().toISOString(),
    likesCount: 95,
    commentsCount: 5,
    company: {
      id: '2',
      name: '小山塗装工業',
      instagramHandle: 'oyama_tosou',
      category: { name: '塗装工事', slug: 'painting-work' }
    }
  },
  {
    id: '3',
    postId: 'mock_3',
    caption: 'お庭のエクステリア工事完了。素敵な空間に生まれ変わりました✨ #外構工事 #エクステリア',
    mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_3',
    timestamp: new Date().toISOString(),
    likesCount: 150,
    commentsCount: 12,
    company: {
      id: '3',
      name: '那須エクステリアデザイン',
      instagramHandle: 'nasu_exterior',
      category: { name: '外構工事', slug: 'exterior-work' }
    }
  },
  {
    id: '4',
    postId: 'mock_4',
    caption: '屋根の葺き替え工事完了。雨漏りの心配もなくなりました🏠 #屋根工事 #リフォーム',
    mediaUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_4',
    timestamp: new Date().toISOString(),
    likesCount: 88,
    commentsCount: 6,
    company: {
      id: '4',
      name: '栃木屋根工事',
      instagramHandle: 'tochigi_yane',
      category: { name: '屋根工事', slug: 'roofing-work' }
    }
  },
  {
    id: '5',
    postId: 'mock_5',
    caption: '電気工事の施工実績です。安全第一で丁寧な作業を心がけています⚡ #電気工事',
    mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_5',
    timestamp: new Date().toISOString(),
    likesCount: 72,
    commentsCount: 4,
    company: {
      id: '5',
      name: '宇都宮電気設備',
      instagramHandle: 'utsunomiya_denki',
      category: { name: '電気工事', slug: 'electrical-work' }
    }
  },
  {
    id: '6',
    postId: 'mock_6',
    caption: '大工工事の現場から。丁寧な仕事を心がけています🔨 #大工工事 #木造住宅',
    mediaUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://instagram.com/p/mock_6',
    timestamp: new Date().toISOString(),
    likesCount: 110,
    commentsCount: 9,
    company: {
      id: '6',
      name: '栃木大工工房',
      instagramHandle: 'tochigi_daiku',
      category: { name: '大工工事', slug: 'carpentry-work' }
    }
  },
  {
    id: '7',
    postId: 'eisho_1',
    caption: 'リフォーム工事完了しました！水回りが新しくなって快適です💧 #栄匠 #リフォーム',
    mediaUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/eisho_1/',
    timestamp: new Date().toISOString(),
    likesCount: 145,
    commentsCount: 15,
    company: {
      id: '7',
      name: '株式会社 栄匠',
      instagramHandle: 'eisho8400',
      category: { name: 'リフォーム', slug: 'reform' }
    }
  },
  {
    id: '8',
    postId: 'eisho_2',
    caption: '外壁塗装と屋根工事の施工事例です。美しい仕上がりになりました✨ #栄匠 #外壁塗装',
    mediaUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/eisho_2/',
    timestamp: new Date().toISOString(),
    likesCount: 132,
    commentsCount: 11,
    company: {
      id: '7',
      name: '株式会社 栄匠',
      instagramHandle: 'eisho8400',
      category: { name: '外壁工事', slug: 'exterior-wall-work' }
    }
  },
  {
    id: '9',
    postId: 'eisho_3',
    caption: '木質リフォームで温かみのある空間に🌲 自然素材にこだわっています #栄匠 #木質リフォーム',
    mediaUrl: 'https://images.unsplash.com/photo-1615875221248-e7c88a4f7a47?w=800',
    mediaType: 'IMAGE',
    permalink: 'https://www.instagram.com/p/eisho_3/',
    timestamp: new Date().toISOString(),
    likesCount: 168,
    commentsCount: 18,
    company: {
      id: '7',
      name: '株式会社 栄匠',
      instagramHandle: 'eisho8400',
      category: { name: 'インテリア工事', slug: 'interior-design-work' }
    }
  }
]

export function InstagramFeedClient({ limit = 9, useEmbeds = true }: InstagramFeedClientProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(mockPosts.slice(0, limit))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/instagram/feed?limit=${limit}`)

        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts')
        }

        const data = await response.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error fetching Instagram posts:', err)
        setError('Instagram投稿の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-16 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="col-span-full text-center py-16 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-muted-foreground">まだInstagram投稿がありません</p>
      </div>
    )
  }

  if (useEmbeds) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {posts.map((post) => (
            <div key={post.id} className="flex justify-center">
              <InstagramEmbed permalink={post.permalink} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            すべての企業を見る
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/companies/${post.company.id}`}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={post.mediaUrl}
              alt={post.caption || `Post by ${post.company.name}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="font-semibold">{post.company.name}</p>
                <p className="text-sm text-white/80">{post.company.category.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          すべての企業を見る
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
