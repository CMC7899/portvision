import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // We only want to attach CORS headers if the request is coming from our specific domain.
  if (origin === 'https://portvision-app.pages.dev') {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Next-Action, Next-Router-State-Tree, Next-Router-Prefetch'
      );
      return response;
    }

    // Handle actual requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  // For all other origins, just let them pass through without CORS headers.
  return NextResponse.next();
}

// This config ensures the middleware runs on all paths.
export const config = {
  matcher: '/:path*',
};
