'use client';

import { Upload } from 'lucide-react';
import { UPLOAD_VIDEO_URL, YOUTUBE_CHANNEL_LINK } from '@/lib/constants';

export default function UploadVideoPage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Upload Video</h1>

        <div className="mt-8 space-y-10">
          <div
            className="w-full rounded-[24px] p-6 text-center"
            style={{ background: '#F9F7F2' }}
          >
            <h2 className="text-2xl font-semibold text-[#1a1a1a]">
              🎉 Participate in Our Weekly Contest!
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-[#4a4a4a]">
              Join our exciting weekly contest and get a chance to shine!
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-[#4a4a4a]">
              To participate, upload a video in your own voice. The video should be 2–5 minutes
              long, recorded in landscape mode, and follow YouTube format guidelines.
            </p>
          </div>

          <section className="relative text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="text-[clamp(200px,40vw,500px)] leading-none text-white/[0.03] select-none">🪷</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-white">
                What&apos;s in it for you?
              </h2>
              <div className="mx-auto mt-4 max-w-2xl space-y-3 text-base leading-relaxed text-white/80">
                <p>
                  The winning video will be uploaded to our{' '}
                  <a
                    href={YOUTUBE_CHANNEL_LINK || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300"
                  >
                    YouTube channel
                  </a>
                  .
                </p>
                <p>
                  It will also be featured in the Winner&apos;s History section of our app.
                </p>
                <p>Don&apos;t miss the chance to show your talent and get recognized!</p>
                <p>Start creating, start winning! 🎬✨</p>
              </div>
            </div>
          </section>

          <div
            className="w-full rounded-[24px] p-8"
            style={{ background: '#2E2E2E' }}
          >
            <p className="text-lg font-medium text-white/90">Upload Video</p>
            <a
              href={UPLOAD_VIDEO_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-white transition-all duration-200 hover:border-white/70 hover:bg-white/[0.02]"
              style={{ height: 320 }}
            >
              <Upload className="size-12 text-white/50" />
              <p className="mt-3 text-base text-white/50">Upload the video</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
