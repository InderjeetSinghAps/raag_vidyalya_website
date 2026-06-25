import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  const url = `https://lh3.googleusercontent.com/d/${id}=w800`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'upstream fetch failed' },
        { status: 502 },
      );
    }

    const contentType =
      response.headers.get('Content-Type') || 'application/octet-stream';
    const contentLength = response.headers.get('Content-Length');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    };
    if (contentLength) headers['Content-Length'] = contentLength;

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: 'proxy error' },
      { status: 502 },
    );
  }
}
