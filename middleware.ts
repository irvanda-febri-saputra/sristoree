import { NextRequest, NextResponse } from 'next/server'
// AISBIRNUSANTARA API SECURITY
export function middleware(req: NextRequest) {
  const url = req.nextUrl
  if (url.pathname.startsWith('/api')) {
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
    const allowedBrowsers = ['chrome', 'safari', 'firefox', 'edge', 'opera']

    const isAllowed = allowedBrowsers.some(browser => userAgent.includes(browser))

    if (!isAllowed) {
      return NextResponse.json(
        { message: 'Broken.pipe()' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'], 
}
