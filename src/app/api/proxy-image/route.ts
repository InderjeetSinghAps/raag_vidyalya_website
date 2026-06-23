import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: 'upstream fetch failed' }, { status: 502 })
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
    const contentLength = response.headers.get('Content-Length')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    }
    if (contentLength) headers['Content-Length'] = contentLength

    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch {
    return NextResponse.json({ error: 'proxy error' }, { status: 502 })
  }
}
