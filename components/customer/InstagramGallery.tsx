'use client';

import { useState, useEffect } from "react";

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
}

interface InstagramGalleryProps {
  companyId: string;
  instagramHandle: string | null;
  limit?: number;
}

export function InstagramGallery({ companyId, instagramHandle, limit = 6 }: InstagramGalleryProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!instagramHandle) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/instagram/posts?companyId=${companyId}&limit=${limit}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch posts');
        }

        setPosts(data.posts);
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [companyId, instagramHandle, limit]);

  if (!instagramHandle) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Instagram連携がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Instagram ギャラリー</h3>
        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          @{instagramHandle}で見る
        </a>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg animate-pulse"
              />
            ))}
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all"
            >
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
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{post.commentsCount}</span>
                    </div>
                  </div>
                  {post.caption && (
                    <p className="text-xs line-clamp-2 px-4">
                      {post.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Video indicator */}
              {post.mediaType === 'VIDEO' && (
                <div className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              )}
            </a>
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              まだInstagram投稿がありません
            </p>
          </div>
        )}
      </div>

      {posts.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          最新の投稿{posts.length}件を表示
        </p>
      )}
    </div>
  );
}
