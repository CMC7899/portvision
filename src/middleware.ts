import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Allow requests from the deployed domain and its subdomains, and from localhost during development.
  const isAllowedOrigin = 
    origin && 
    (origin.endsWith('.portvision-app.pages.dev') || origin.startsWith('http://localhost'));

  // If the origin is not allowed, we don't add any CORS headers.
  if (!isAllowedOrigin) {
    return NextResponse.next();
  }
  
  // Create a new response so we can modify headers
  const response = request.method === 'OPTIONS' 
    ? new NextResponse(null, { status: 204 }) // For preflight, return 204 No Content
    : NextResponse.next();

  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

export const config = {
  // Apply this middleware to all paths to catch Server Action POST requests.
  matcher: '/:path*',
};
