/**
 * Instagram OAuth Callback Page
 * Handles the redirect from Instagram OAuth and sends data back to parent window
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function InstagramCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (window.opener) {
      if (error) {
        // Send error to parent window
        window.opener.postMessage(
          {
            type: 'instagram-auth-error',
            error: errorDescription || error,
          },
          window.location.origin
        );
      } else if (code && state) {
        // Send success to parent window
        window.opener.postMessage(
          {
            type: 'instagram-auth-success',
            code,
            state,
          },
          window.location.origin
        );
      } else {
        // Invalid callback
        window.opener.postMessage(
          {
            type: 'instagram-auth-error',
            error: 'Invalid callback parameters',
          },
          window.location.origin
        );
      }
    }

    // Close the popup after a short delay
    setTimeout(() => {
      window.close();
    }, 1000);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Instagram authentication...</p>
        <p className="text-sm text-gray-500 mt-2">This window will close automatically.</p>
      </div>
    </div>
  );
}
