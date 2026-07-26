"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetCourseVideoBookmarksQuery } from '@/store/api';
import { getYouTubeEmbedUrl } from '@/lib/video';

export default function BookmarkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetCourseVideoBookmarksQuery();
  const bookmark = data?.bookmarks.find((b) => b._id === params.id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!bookmark) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">Bookmark not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="size-4" />
        Back to Bookmarks
      </Button>
      
      <h1 className="mb-4 text-2xl font-bold">{bookmark.title}</h1>
      
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={`${getYouTubeEmbedUrl(bookmark.videoUrl)}&autoplay=1`}
          title={bookmark.title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {bookmark.description}
      </p>
    </div>
  );
}
