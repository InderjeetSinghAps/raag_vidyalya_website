import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  let pdfUrl: string
  const driveMatch = url.match(/\/file\/d\/([^/]+)/)
  if (driveMatch) {
    pdfUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`
  } else {
    pdfUrl = url
  }

  try {
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      return new NextResponse("Failed to fetch PDF", { status: 502 })
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return new NextResponse("Failed to fetch PDF", { status: 502 })
  }
}
