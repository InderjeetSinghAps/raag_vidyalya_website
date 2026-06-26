'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Search,
  Clock,
  User as UserIcon,
  Loader2,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useGetVideosQuery,
  useGetCourseVideoBookmarksQuery,
  useAddCourseVideoBookmarkMutation,
  useRemoveCourseVideoBookmarkMutation,
} from '@/store/api';

export default function VideosPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading: loading } = useGetVideosQuery({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
  });
  const videos = data?.videos ?? [];
  const totalPages = data?.totalPages ?? 1;

  const { data: bookmarksData } = useGetCourseVideoBookmarksQuery();
  const [bookmarkedUrls, setBookmarkedUrls] = useState(() => new Set(
    bookmarksData?.bookmarks?.map((b) => b.videoUrl) ?? [],
  ));
  useEffect(() => {
    setBookmarkedUrls(new Set(
      bookmarksData?.bookmarks?.map((b) => b.videoUrl) ?? [],
    ));
  }, [bookmarksData]);
  const [addBookmark] = useAddCourseVideoBookmarkMutation();
  const [removeBookmark] = useRemoveCourseVideoBookmarkMutation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">
            Videos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn Gurmat Sangeet through expert-led videos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => router.push(`/videos/${video.id}`)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(212,164,74,0.08)]"
                >
                  <div className="relative flex aspect-video items-center justify-center bg-black/20">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="size-full object-cover"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img.naturalWidth < 200) {
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
                          }
                        }}
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
                    <Play
                      className={`absolute inset-0 m-auto size-10 text-muted-foreground/60 transition-colors group-hover:text-primary/60 ${video.thumbnail ? 'hidden' : ''}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/80 text-white opacity-0 shadow-lg transition-all group-hover:opacity-100 group-hover:scale-110">
                        <Play className="size-5 ml-0.5" />
                      </div>
                    </div>
                    {video.duration && (
                      <Badge
                        variant="secondary"
                        className="absolute bottom-2 right-2 border-none bg-black/60 text-[10px] text-white backdrop-blur-sm"
                      >
                        <Clock className="mr-1 size-3" />
                        {video.duration}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 z-10 text-white/70 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isBookmarked = bookmarkedUrls.has(
                          video.videoUrl,
                        );
                        if (isBookmarked) {
                          const bookmark =
                            bookmarksData?.bookmarks?.find(
                              (b) => b.videoUrl === video.videoUrl,
                            );
                          if (bookmark) {
                            removeBookmark(bookmark._id);
                            setBookmarkedUrls(prev => {
                              const next = new Set(prev);
                              next.delete(video.videoUrl);
                              return next;
                            });
                            toast.success('Removed from bookmarks');
                          }
                        } else {
                          addBookmark({
                            title: video.title,
                            videoUrl: video.videoUrl,
                            description: video.description,
                          });
                          setBookmarkedUrls(prev => {
                            const next = new Set(prev);
                            next.add(video.videoUrl);
                            return next;
                          });
                          toast.success('Added to bookmarks');
                        }
                      }}
                    >
                      <Bookmark
                        className={`size-5 transition-colors ${
                          bookmarkedUrls.has(video.videoUrl)
                            ? 'fill-primary text-primary'
                            : ''
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="space-y-1.5 p-3">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {video.title}
                    </p>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/70">
                      {video.description}
                    </p>
                    {video.instructor && (
                      <div className="flex items-center gap-1.5 pt-1 text-[10px] font-medium text-muted-foreground/60">
                        <UserIcon className="size-3" />
                        {video.instructor}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {videos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Play className="mb-4 size-12 text-muted-foreground/80" />
                <p className="text-lg text-muted-foreground">
                  No videos found
                </p>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  Try a different search term
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    className={
                      p === page
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : ''
                    }
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
