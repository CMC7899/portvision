import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle preflight requests (OPTIONS) for CORS
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    const origin = request.headers.get('origin');

    // Dynamically set the allowed origin based on the request.
    // For production, you might want to restrict this to a specific list of domains.
    if (origin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'POST, GET, OPTIONS' // Server Actions primarily use POST
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      // Allow Next.js specific headers for Server Actions
      'Content-Type, Next-Action, Next-Router-State-Tree, Next-Router-Prefetch'
    );

    return response;
  }

  // For all other requests, just let them pass through.
  return NextResponse.next();
}

// This config ensures the middleware runs on all paths, which is
// necessary to catch the Server Action calls.
export const config = {
  matcher: '/:path*',
};
