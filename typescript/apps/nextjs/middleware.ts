// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED = ['ja', 'en'] as const

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /projects 以下（work/... を含む）を全キャッチ
  if (pathname.startsWith('/projects')) {
    // Accept-Language からロケール判定
    const accept = request.headers.get('accept-language') ?? ''
    const preferred = accept.split(',')[0].split('-')[0]
    const locale = SUPPORTED.includes(preferred as any) ? preferred : 'en'

    // 既に /ja/ や /en/ が付いていたら何もしない
    if (!pathname.startsWith(`/${locale}/projects`)) {
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname}`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// /projects とその下位パスすべてをミドルウェアに通す
export const config = {
  matcher: ['/projects/:path*'],
}
