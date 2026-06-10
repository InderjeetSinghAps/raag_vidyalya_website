'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Music,
  Users,
  Globe,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Camera, Play as PlayIcon } from 'lucide-react';
import { courses, raags } from '@/data';
import { socialLinks } from '@/data/contact';

const socialIcons: Record<string, React.ElementType> = {
  'play-store': Smartphone,
  'app-store': ExternalLink,
  instagram: Camera,
  youtube: PlayIcon,
};

const stats = [
  {
    icon: Music,
    value: raags.length,
    label: 'Raags',
  },
  {
    icon: BookOpen,
    value: courses.length,
    label: 'Courses',
  },
  {
    icon: Users,
    value: '2K+',
    label: 'Students',
  },
  {
    icon: Globe,
    value: '5+',
    label: 'Years',
  },
];

const appLinks = [
  {
    label: 'Play Store',
    url: 'https://play.google.com/store/apps/details?id=com.raag.raagvidalya',
    icon: Smartphone,
  },
  {
    label: 'App Store',
    url: 'https://apps.apple.com/us/app/raag-vidyalya/id6773085164',
    icon: ExternalLink,
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            About Raag Vidyalaya
          </h1>
          <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
        </div>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-balance text-2xl font-bold text-foreground">
              Preserving the Divine Art of Gurmat Sangeet
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Raag Vidyalaya is dedicated to preserving and sharing
              the sacred tradition of Gurmat Sangeet — the classical
              music of the Sikh faith. Our platform brings together
              authentic raags, traditional hymns, and expert guidance
              to make this divine art accessible to learners
              worldwide.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you are a beginner taking your first steps or an
              advanced practitioner deepening your understanding, Raag
              Vidyalaya offers structured courses, detailed raag
              theory, and a rich library of gurbani kirtan to support
              your journey.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => router.push('/courses')}
                className="h-11 border-0 px-6 text-sm font-medium text-[#081527] transition-all duration-200 active:scale-[0.96]"
                style={{
                  background: 'var(--color-primary, #D4A44A)',
                }}
              >
                Browse Courses
              </Button>
              <Button
                variant="outline"
                className="h-11 border-primary px-6 text-sm font-medium text-primary transition-all duration-200 active:scale-[0.96]"
                onClick={() => router.push('/gurmat-sangeet')}
              >
                Explore Raags
              </Button>
            </div>
          </div>

          <div className="aspect-video overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <iframe
              src="https://www.youtube.com/embed/1dUR7B2-CwY"
              title="Raag Vidyalaya"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-card p-6 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(212,164,74,0.2),0_4px_12px_rgba(0,0,0,0.2)]"
              >
                <stat.icon className="mx-auto size-6 text-primary" />
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="rounded-2xl bg-card p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <h2 className="text-balance text-2xl font-bold text-foreground">
              Download the App
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Access Raag Vidyalaya on the go. Available on both
              platforms.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {appLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="h-11 border-primary px-6 text-sm font-medium text-primary transition-all duration-200 active:scale-[0.96]"
                  >
                    <link.icon className="mr-2 size-4" />
                    {link.label}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* <section className="mt-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Follow Us
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.icon] || ExternalLink
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(212,164,74,0.2),0_4px_12px_rgba(0,0,0,0.2)] active:scale-[0.97]"
                >
                  <Icon className="size-4 text-primary" />
                  {link.label}
                </a>
              )
            })}
          </div>
        </section> */}
      </div>
    </div>
  );
}
