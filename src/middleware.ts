import { type NextRequest, NextResponse } from 'next/server';

// This function will check if the request origin is allowed.
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) {
    // Allow same-origin requests (e.g., from the app itself)
    return true;
  }

  try {
    const originHost = new URL(origin).hostname;
    
    // Allow localhost for local development
    if (originHost === 'localhost') {
      return true;
    }

    // Allow any subdomain of vercel.app
    if (originHost.endsWith('.vercel.app')) {
      return true;
    }
    
    // Allow any subdomain of pages.dev (for Cloudflare Pages)
    if (originHost.endsWith('.pages.dev')) {
      return true;
    }

    // Allow any subdomain of workers.dev (for Cloudflare Workers)
    if (originHost.endsWith('.workers.dev')) {
      return true;
    }

  } catch (err) {
    // Invalid origin URL
    return false;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (isOriginAllowed(origin)) {
    // Handle preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set('Access-Control-Allow-Origin', origin!);
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
    response.headers.set('Access-control-allow-origin', origin!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }
  
  // For any other origins, let the request proceed without CORS headers.
  // The browser will then block it if the origin is not allowed.
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
