'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { getYouTubeVideoId } from '@/lib/video';
import type { Course } from '@/types';

interface CourseCardImageProps {
  course: Course;
}

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-500/20',
  Intermediate: 'text-amber-400 border-amber-500/20',
  Advanced: 'text-rose-400 border-rose-500/20',
};

export function CourseCardImage({ course }: CourseCardImageProps) {
  const [state, setState] = useState<
    'maxresdefault' | 'hqdefault' | 'failed'
  >('maxresdefault');

  const videoId = getYouTubeVideoId(course.videos?.[0]?.videoUrl);
  const thumbSrc =
    course.thumbnail ??
    (state !== 'failed' && videoId
      ? `https://img.youtube.com/vi/${videoId}/${state}.jpg`
      : null);

  return (
    <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-t-xl bg-transparent">
      {thumbSrc ? (
        <Image
          src={thumbSrc}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
          onError={() => {
            setState((prev) =>
              prev === 'maxresdefault' ? 'hqdefault' : 'failed',
            );
          }}
        />
      ) : null}
      <Badge className="absolute left-2 top-2 border border-amber-500/30 bg-background/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 uppercase tracking-wider backdrop-blur-sm">
        {course.isFree ? 'Free' : 'Paid'}
      </Badge>
      <Badge
        className={`absolute right-2 top-2 border bg-background/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${levelColors[course.level] || ''}`}
      >
        {course.level}
      </Badge>
      <BookOpen className="size-12 text-cyan-400/30" />
    </div>
  );
}
