import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json(
      { error: 'missing url' },
      { status: 400 },
    );
  }

  try {
    const upstreamHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0',
    };

    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      upstreamHeaders['Range'] = rangeHeader;
    }

    const response = await fetch(url, { headers: upstreamHeaders });
    // console.log("URL:", url)
    // console.log("Status:", response.status)
    // console.log("Content-Type:", response.headers.get("content-type"))
    // console.log("Content-Length:", response.headers.get("content-length"))
    // console.log("Content-Range:", response.headers.get("content-range"))
    // console.log("Accept-Ranges:", response.headers.get("accept-ranges"))

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: 'upstream fetch failed' },
        { status: 502 },
      );
    }

    // Validate content type
    const contentType = response.headers.get('Content-Type') || '';
    if (
      !contentType.startsWith('audio/') &&
      !contentType.startsWith('application/octet-stream')
    ) {
      return NextResponse.json(
        { error: 'invalid content type: ' + contentType },
        { status: 502 },
      );
    }

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes',
    };

    const contentLength = response.headers.get('Content-Length');
    if (contentLength)
      responseHeaders['Content-Length'] = contentLength;

    if (response.status === 206) {
      const contentRange = response.headers.get('Content-Range');
      if (contentRange)
        responseHeaders['Content-Range'] = contentRange;
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: 'proxy error' },
      { status: 502 },
    );
  }
}
