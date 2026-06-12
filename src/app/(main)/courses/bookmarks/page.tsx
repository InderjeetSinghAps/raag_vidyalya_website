'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Play,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetCourseVideoBookmarksQuery } from '@/store/api';
import { getYouTubeVideoId } from '@/lib/video';

export default function BookmarksPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetCourseVideoBookmarksQuery();
  const bookmarks = data?.bookmarks || [];

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button> */}
        <div className="px-5 mt-[-25px]">
          <Button
            variant="ghost"
            size="lg"
            className="gap-1.5"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-balance text-2xl font-bold text-foreground">
                My Bookmarks
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue your learning journey
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
            />
          </div>
        </div>

        <div className="mt-8 mb-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookmarks.map((bookmark) => {
              const thumbSrc = getYouTubeVideoId(bookmark.videoUrl)
                ? `https://img.youtube.com/vi/${getYouTubeVideoId(bookmark.videoUrl)}/maxresdefault.jpg`
                : null;
              return (
                <div
                  key={bookmark._id}
                  onClick={() => {
                    router.push(`/courses/bookmarks/${bookmark._id}`);
                  }}
                  className="group flex cursor-pointer flex-col rounded-xl border border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                >
                  <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-background">
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={bookmark.title}
                        referrerPolicy="no-referrer"
                        className="size-full object-cover"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src.includes('maxresdefault')) {
                            img.src = img.src.replace(
                              'maxresdefault',
                              'hqdefault',
                            );
                          } else {
                            img.style.display = 'none';
                            img.nextElementSibling?.classList.remove(
                              'hidden',
                            );
                          }
                        }}
                      />
                    ) : null}
                    <Play className="hidden size-12 text-cyan-400/30" />
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-4">
                    <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                      {bookmark.title}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                      {bookmark.description}
                    </p>
                    <Button
                      variant="default"
                      className="mt-auto w-full bg-cyan-500 text-foreground hover:bg-cyan-400 active:scale-[0.96]"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/courses/bookmarks/${bookmark._id}`,
                        );
                      }}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBookmarks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="mb-4 size-12 text-muted-foreground/80" />
              <p className="text-lg text-muted-foreground">
                No bookmarks found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/80">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
