'use client';

import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewerClient({ url }: { url: string }) {
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [spreadStart, setSpreadStart] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPDF() {
      setLoading(true);
      setError(null);
      setPdfDoc(null);
      try {
        const response = await fetch(proxyUrl);
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        const pdf = await getDocument({
          data: new Uint8Array(buffer),
        }).promise;
        if (cancelled) {
          pdf.cleanup();
          return;
        }
        setNumPages(pdf.numPages);
        setSpreadStart(1);
        setPdfDoc(pdf);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load PDF',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPDF();
    return () => {
      cancelled = true;
    };
  }, [proxyUrl]);

  useEffect(() => {
    if (
      !leftCanvasRef.current ||
      !rightCanvasRef.current ||
      !containerRef.current ||
      !pdfDoc
    )
      return;

    let cancelled = false;

    async function renderSpread() {
      try {
        const container = containerRef.current!;
        const cw = container.clientWidth - 2;
        const ch = container.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        const halfW = (cw - 4) / 2;

        const leftPage = await pdfDoc.getPage(1);
        const vp = leftPage.getViewport({ scale: 1 });
        const scale = Math.min(halfW / vp.width, ch / vp.height);

        const left = await pdfDoc.getPage(spreadStart);
        const leftVp = left.getViewport({ scale });
        const lc = leftCanvasRef.current!;
        lc.width = leftVp.width * dpr;
        lc.height = leftVp.height * dpr;
        lc.style.width = leftVp.width + 'px';
        lc.style.height = leftVp.height + 'px';
        const lctx = lc.getContext('2d')!;
        lctx.scale(dpr, dpr);
        if (cancelled) return;
        await left.render({
          canvasContext: lctx,
          canvas: lc,
          viewport: leftVp,
        }).promise;

        const rp = spreadStart + 1;
        const rc = rightCanvasRef.current!;
        if (rp <= numPages) {
          rc.style.display = '';
          const right = await pdfDoc.getPage(rp);
          const rightVp = right.getViewport({ scale });
          rc.width = rightVp.width * dpr;
          rc.height = rightVp.height * dpr;
          rc.style.width = rightVp.width + 'px';
          rc.style.height = rightVp.height + 'px';
          const rctx = rc.getContext('2d')!;
          rctx.scale(dpr, dpr);
          if (cancelled) return;
          await right.render({
            canvasContext: rctx,
            canvas: rc,
            viewport: rightVp,
          }).promise;
        } else {
          rc.style.display = 'none';
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to render page',
          );
        }
      }
    }

    renderSpread();
    return () => {
      cancelled = true;
    };
  }, [spreadStart, pdfDoc, numPages]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const goToSpread = (p: number) => {
    setSpreadStart(p % 2 === 1 ? p : p - 1);
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl h-full overflow-hidden rounded-2xl bg-transparent shadow-[0_20px_60px_rgba(0,0,0,.35)] dark:bg-neutral-900">
      <div ref={containerRef} className="flex h-full flex-col">
        <div className="flex-1 min-h-0 flex flex-row items-center justify-center gap-1 bg-white dark:bg-neutral-900">
          {loading && (
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              Loading PDF...
            </div>
          )}
          <canvas
            ref={leftCanvasRef}
            className={`max-w-full max-h-full shadow-sm dark:invert ${loading ? 'hidden' : ''}`}
            // className={`max-w-full max-h-full shadow-sm dark:invert ${loading ? 'hidden' : ''}`}
          />
          <canvas
            ref={rightCanvasRef}
            className={`max-w-full max-h-full shadow-sm dark:invert ${loading ? 'hidden' : ''}`}
            // className={`max-w-full max-h-full shadow-sm dark:invert ${loading ? 'hidden' : ''}`}
          />
        </div>
        {numPages > 0 && (
          <div className="-mt-12 pb-20 pl-4">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-[rgba(20,22,28,.85)] p-1 backdrop-blur-2xl">
              {Array.from({ length: numPages }, (_, i) => {
                const p = i + 1;
                const inSpread =
                  p === spreadStart || p === spreadStart + 1;
                return (
                  <button
                    key={i}
                    onClick={() => goToSpread(p)}
                    className={`flex size-9 items-center justify-center rounded-xl text-xs font-medium transition-all ${
                      inSpread
                        ? 'bg-gradient-to-b from-[#D4B06A] to-[#A8782F] font-semibold text-[#111]'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
