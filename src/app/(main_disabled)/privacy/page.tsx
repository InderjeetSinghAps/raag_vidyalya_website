'use client';

import { ArrowLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const sections = [
    {
      title: 'Information Collection and Use',
      text: 'Raag Vidyalaya respects your privacy. We do not collect personal data without your consent. If information such as name or email is collected, it is only for improving your learning experience or connecting with personal tutors.',
    },
    {
      title: 'Data Storage and Security',
      text: 'All data is securely stored and protected. We use Firebase to manage user data, ensuring encrypted communication and secure access at all times.',
    },
    {
      title: 'Audio and Media Usage',
      text: 'All audio, notations, and materials are for educational purposes only. Redistribution, resale, or public reproduction without authorization is prohibited.',
    },
    {
      title: 'Third-Party Services',
      text: 'We may use services like Firebase Analytics or AdMob to analyze app performance. These tools may collect limited technical data (e.g., device type, app usage time) but never personal or religious data.',
    },
    {
      title: 'User Rights',
      text: 'You can request to access or delete your data anytime by contacting our support team. We respect your right to data privacy.',
    },
    {
      title: 'Updates to This Policy',
      text: 'We may update this policy periodically. Any updates will be reflected here, along with a new revision date.',
    },
    {
      title: 'Contact Us',
      text: 'For any concerns or questions, please contact us at: inderjeetsinghpbi@gmail.com',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Shield className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 2025</p>
        </div>
      </div>

      <p className="mb-8 text-xs font-medium text-foreground">
        Raag Vidyalaya is an educational platform dedicated to learning Gurmat
        Sangeet — the sacred music tradition of Sikhism. The app provides
        guidance on the 31 Raags mentioned in Sri Guru Granth Sahib Ji, with
        professional notations and learning resources for students and musicians.
      </p>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <div key={section.title}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary/80">
              {section.title}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {section.text}
            </p>
            {i < sections.length - 1 && (
              <div className="mt-6 h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
            )}
          </div>
        ))}
      </div>

      <p className="pt-8 text-center text-[10px] text-muted-foreground/40">
        &copy; 2026 Raag Vidyalya. All Rights Reserved.
      </p>
    </div>
  );
}
