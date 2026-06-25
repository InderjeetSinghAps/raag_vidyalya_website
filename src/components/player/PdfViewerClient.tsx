"use client"

import { useEffect, useRef } from "react"
import { Viewer, Worker, ViewMode, SpecialZoomLevel } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"

export default function PdfViewerClient({ url }: { url: string }) {
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLElement>(".rpv-core__viewer-container")
    if (el) {
      el.style.overflow = "hidden"
    }
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  })

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,.35)] dark:bg-neutral-900"
    >
      <style>{`html.dark .rpv-core__viewer { filter: invert(1); } .rpv-core__viewer { height: 100%; }`}</style>
      <Worker workerUrl="/pdf.worker.min.mjs">
        <div className="h-full">
          <Viewer fileUrl={proxyUrl} viewMode={ViewMode.DualPage} defaultScale={SpecialZoomLevel.PageFit} />
        </div>
      </Worker>
    </div>
  )
}
