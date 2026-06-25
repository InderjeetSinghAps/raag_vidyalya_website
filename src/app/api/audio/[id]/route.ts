import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  const url = `https://drive.google.com/uc?export=download&id=${id}`;

  try {
    const upstreamHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0',
    };

    const rangeHeader = _request.headers.get('range');
    if (rangeHeader) {
      upstreamHeaders['Range'] = rangeHeader;
    }

    const response = await fetch(url, { headers: upstreamHeaders });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: 'upstream fetch failed' },
        { status: 502 },
      );
    }

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
    if (contentLength) responseHeaders['Content-Length'] = contentLength;

    if (response.status === 206) {
      const contentRange = response.headers.get('Content-Range');
      if (contentRange) responseHeaders['Content-Range'] = contentRange;
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
