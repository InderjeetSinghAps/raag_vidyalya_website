'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  AlertCircle,
  Play,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetCollaboratorByIdQuery } from '@/store/api';
import { getYouTubeVideoId } from '@/lib/video';
import type { ContentItem } from '@/types';

function VideoCard({ item }: { item: ContentItem }) {
  const videoId = getYouTubeVideoId(item.url);
  const [thumbQuality, setThumbQuality] = useState<'maxresdefault' | 'hqdefault'>('maxresdefault');
  const [imgError, setImgError] = useState(false);
  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/${thumbQuality}.jpg` : null;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="relative flex aspect-video items-center justify-center bg-muted">
        {thumb && !imgError ? (
          <img
            src={thumb}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover"
            onLoad={(e) => {
              if (e.currentTarget.naturalWidth < 200) {
                if (thumbQuality === 'maxresdefault') {
                  setThumbQuality('hqdefault');
                } else {
                  setImgError(true);
                }
              }
            }}
            onError={() => {
              if (thumbQuality === 'maxresdefault') {
                setThumbQuality('hqdefault');
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="flex items-center text-muted-foreground/60">
            <Play className="size-8" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/card:opacity-100">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
            <Play className="size-5 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h4 className="line-clamp-2 text-sm font-medium text-foreground">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/70">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
}

export default function CollaboratorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    data: collaborator,
    isLoading,
    error,
  } = useGetCollaboratorByIdQuery(id);
  const [coverError, setCoverError] = useState(false);
  const [profileError, setProfileError] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="mb-8 h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !collaborator) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="size-7 text-red-500" />
          </div>
          <p className="text-muted-foreground">
            Collaborator not found
          </p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const hasSections =
    collaborator.sections && collaborator.sections.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 via-primary/60 to-primary/30"
      >
        {collaborator.coverProfile && !coverError ? (
          <img
            src={collaborator.coverProfile}
            alt=""
            className="h-56 w-full object-cover sm:h-72"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="h-56 sm:h-72" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="-mt-20 mb-8 text-center sm:-mt-24"
      >
        <div className="mx-auto size-24 overflow-hidden rounded-full border-4 border-background bg-muted sm:size-28">
          {collaborator.profile && !profileError ? (
            <img
              src={collaborator.profile}
              alt={collaborator.name}
              className="size-full object-cover"
              onError={() => setProfileError(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <User className="size-10 text-muted-foreground/60" />
            </div>
          )}
        </div>

        <h1 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">
          {collaborator.name}
        </h1>

        {collaborator.profession && (
          <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
            {collaborator.profession}
          </span>
        )}

        {(collaborator.email || collaborator.phoneNumber) && (
          <div className="mt-3 flex items-center justify-center gap-4">
            {collaborator.email && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Mail className="size-3.5 shrink-0" />
                {collaborator.email}
              </div>
            )}
            {collaborator.phoneNumber && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Phone className="size-3.5 shrink-0" />
                {collaborator.phoneNumber}
              </div>
            )}
            {collaborator.address && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Phone className="size-3.5 shrink-0" />
                {collaborator.address}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {collaborator.bio && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8 text-sm leading-relaxed text-muted-foreground/80"
        >
          {collaborator.bio}
        </motion.p>
      )}

      {hasSections ? (
        <div className="space-y-10">
          {collaborator.sections!.map((section, idx) => (
            <motion.div
              key={section._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    {section.description}
                  </p>
                )}
              </div>
              {section.content.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.content
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <VideoCard key={item._id} item={item} />
                    ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground/60">
                  No items in this section.
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Users className="size-7 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No content yet
          </p>
          <p className="text-xs text-muted-foreground/60">
            This collaborator hasn't added any content sections yet.
          </p>
        </motion.div>
      )}
    </div>
  );
}
