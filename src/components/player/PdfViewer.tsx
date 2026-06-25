"use client"

import dynamic from "next/dynamic"

const PdfViewerClient = dynamic(() => import("./PdfViewerClient"), { ssr: false })

export function PdfViewer({ url }: { url: string }) {
  return <PdfViewerClient url={url} />
}
