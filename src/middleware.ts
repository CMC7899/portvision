import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Allow requests from the main domain and any subdomains.
  const isAllowedOrigin = origin && (
    origin === 'https://portvision-app.pages.dev' || 
    origin.endsWith('.portvision-app.pages.dev')
  );

  if (isAllowedOrigin) {
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
