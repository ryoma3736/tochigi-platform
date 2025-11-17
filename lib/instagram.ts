/**
 * Instagram Graph API Wrapper
 * Handles Instagram authentication, post fetching, and publishing
 */

interface InstagramMedia {
  id: string;
  caption?: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramUser {
  id: string;
  username: string;
  media_count: number;
}

interface InstagramApiResponse<T> {
  data: T;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export class InstagramAPI {
  private baseUrl = 'https://graph.instagram.com';

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    user_id: number;
  }> {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Instagram OAuth error: ${error.error_message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Exchange short-lived token for long-lived token
   */
  async getLongLivedToken(accessToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/access_token?` +
        new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          access_token: accessToken,
        })
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get long-lived token: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Refresh long-lived access token
   */
  async refreshAccessToken(accessToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/refresh_access_token?` +
        new URLSearchParams({
          grant_type: 'ig_refresh_token',
          access_token: accessToken,
        })
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to refresh token: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Get Instagram user profile
   */
  async getUserProfile(accessToken: string): Promise<InstagramUser> {
    const response = await fetch(
      `${this.baseUrl}/me?` +
        new URLSearchParams({
          fields: 'id,username,media_count',
          access_token: accessToken,
        })
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get user profile: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Get user's media posts
   */
  async getUserMedia(
    accessToken: string,
    limit: number = 25
  ): Promise<InstagramApiResponse<InstagramMedia[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/media?` +
          new URLSearchParams({
            fields: 'id,caption,media_url,media_type,permalink,timestamp,like_count,comments_count',
            limit: limit.toString(),
            access_token: accessToken,
          }),
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.error_message || 'Unknown error';

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error(`Instagram authentication failed: ${errorMessage}. Please reconnect your Instagram account.`);
        } else if (response.status === 403) {
          throw new Error(`Instagram API permission denied: ${errorMessage}. Please check your app permissions.`);
        } else if (response.status === 429) {
          throw new Error(`Instagram API rate limit exceeded: ${errorMessage}. Please try again later.`);
        }

        throw new Error(`Failed to get user media: ${errorMessage}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch Instagram media: Network error');
    }
  }

  /**
   * Get specific media details
   */
  async getMediaDetails(mediaId: string, accessToken: string): Promise<InstagramMedia> {
    const response = await fetch(
      `${this.baseUrl}/${mediaId}?` +
        new URLSearchParams({
          fields: 'id,caption,media_url,media_type,permalink,timestamp,like_count,comments_count',
          access_token: accessToken,
        })
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get media details: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Create container for publishing photo
   */
  async createPhotoContainer(
    accessToken: string,
    imageUrl: string,
    caption?: string
  ): Promise<{ id: string }> {
    const params: Record<string, string> = {
      image_url: imageUrl,
      access_token: accessToken,
    };

    if (caption) {
      params.caption = caption;
    }

    const response = await fetch(`${this.baseUrl}/me/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create photo container: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Publish media container
   */
  async publishMedia(accessToken: string, creationId: string): Promise<{ id: string }> {
    const response = await fetch(`${this.baseUrl}/me/media_publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to publish media: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  /**
   * Get Instagram authorization URL
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
      scope: 'user_profile,user_media',
      response_type: 'code',
    });

    return `https://api.instagram.com/oauth/authorize?${params}`;
  }
}

export const instagramAPI = new InstagramAPI();
