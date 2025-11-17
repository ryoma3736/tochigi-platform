'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InstagramPost {
  id: string;
  postId: string;
  caption: string | null;
  mediaUrl: string;
  mediaType: string;
  permalink: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  company: {
    id: string;
    name: string;
    instagramHandle: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

interface InstagramFeedProps {
  limit?: number;
}

export function InstagramFeed({ limit = 9 }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/instagram/feed?limit=${limit}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        setPosts(data.posts);
      } catch (err) {
        console.error('Failed to fetch Instagram feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [limit]);

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Instagram投稿の読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid of Instagram posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          // Loading skeleton
          <>
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl animate-pulse"
              />
            ))}
          </>
        ) : posts.length > 0 ? (
          // Display posts
          posts.map((post, index) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isLoading ? 'none' : 'fadeIn 0.5s ease-out forwards',
              }}
            >
              {/* Image */}
              {post.mediaType === 'VIDEO' ? (
                <video
                  src={post.mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* Top section - Company info */}
                <div className="flex items-start justify-between">
                  <Link
                    href={`/companies/${post.company.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-white transition-colors shadow-lg"
                  >
                    {post.company.name}
                  </Link>
                  {post.mediaType === 'VIDEO' && (
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bottom section - Post info */}
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold">{post.commentsCount}</span>
                    </div>
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-white text-sm line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  )}

                  {/* Instagram handle */}
                  {post.company.instagramHandle && (
                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="text-xs">@{post.company.instagramHandle}</span>
                    </div>
                  )}
                </div>
              </div>
            </a>
          ))
        ) : (
          // No posts
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
        )}
      </div>

      {/* View all link */}
      {posts.length > 0 && (
        <div className="text-center">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            もっと見る
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
