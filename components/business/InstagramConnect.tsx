/**
 * Instagram Connect Component
 * Handle Instagram OAuth authentication and account management
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InstagramConnectProps {
  companyId: string;
  isConnected: boolean;
  instagramHandle?: string | null;
  onConnectionChange?: () => void;
}

export default function InstagramConnect({
  companyId,
  isConnected,
  instagramHandle,
  onConnectionChange,
}: InstagramConnectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Initiate Instagram OAuth flow
   */
  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get authorization URL from API
      const response = await fetch(`/api/instagram/auth?companyId=${companyId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authorization URL');
      }

      // Open Instagram authorization in popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        data.authUrl,
        'Instagram Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'instagram-auth-success') {
          window.removeEventListener('message', handleMessage);
          popup?.close();

          const { code, state } = event.data;

          // Exchange code for token
          try {
            const tokenResponse = await fetch('/api/instagram/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code, state }),
            });

            const tokenData = await tokenResponse.json();

            if (!tokenResponse.ok) {
              throw new Error(tokenData.error || 'Failed to authenticate');
            }

            setSuccess(`Successfully connected to @${tokenData.username}`);
            setLoading(false);

            // Trigger sync after successful connection
            await handleSync();

            // Notify parent component
            if (onConnectionChange) {
              onConnectionChange();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setLoading(false);
          }
        } else if (event.data.type === 'instagram-auth-error') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          setError(event.data.error || 'Authentication failed');
          setLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was closed without completing auth
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          if (loading) {
            setError('Authentication cancelled');
            setLoading(false);
          }
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setLoading(false);
    }
  };

  /**
   * Disconnect Instagram account
   */
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Instagram account? This will remove all synced posts.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/instagram/auth?companyId=${companyId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disconnect');
      }

      setSuccess('Instagram account disconnected successfully');
      setLoading(false);

      // Notify parent component
      if (onConnectionChange) {
        onConnectionChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
      setLoading(false);
    }
  };

  /**
   * Manually sync Instagram posts
   */
  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/instagram/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync posts');
      }

      setSuccess(`Successfully synced ${data.syncedCount} posts`);
      setLoading(false);

      // Notify parent component
      if (onConnectionChange) {
        onConnectionChange();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync posts');
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram連携</CardTitle>
        <CardDescription>
          Instagramアカウントを接続して、投稿を自動的に同期します
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-md">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium text-green-800">
                  接続中: @{instagramHandle}
                </p>
                <p className="text-sm text-green-600">
                  Instagramアカウントが正常に接続されています
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">自動同期について</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 投稿は6時間ごとに自動的に同期されます</li>
                <li>• 最新50件の投稿が同期対象です</li>
                <li>• いいね数とコメント数も更新されます</li>
                <li>• 手動で同期することも可能です</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium text-gray-800">
                  未接続
                </p>
                <p className="text-sm text-gray-600">
                  Instagramアカウントを接続してください
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Instagram連携の機能</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Instagram投稿の自動同期</li>
                <li>• プラットフォームでの投稿表示</li>
                <li>• いいね数・コメント数の表示</li>
                <li>• 投稿スケジュール機能（準備中）</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>注意:</strong> Instagram Business アカウントまたは
                Instagram Creator アカウントが必要です。個人アカウントでは利用できません。
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3">
        {isConnected ? (
          <>
            <Button
              onClick={handleSync}
              disabled={loading}
              variant="default"
            >
              {loading ? '同期中...' : '今すぐ同期'}
            </Button>
            <Button
              onClick={handleDisconnect}
              disabled={loading}
              variant="destructive"
            >
              {loading ? '処理中...' : '接続解除'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full"
          >
            {loading ? '接続中...' : 'Instagramと接続'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
