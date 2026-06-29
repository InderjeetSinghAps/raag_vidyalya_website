'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  const sections = [
    {
      title: 'Acceptance of Terms',
      text: 'By accessing or using Raag Vidyalya, you agree to these Terms & Conditions. If you do not agree, please refrain from using the app.',
    },
    {
      title: 'Purpose of the App',
      text: 'Raag Vidyalya is intended solely for educational and devotional learning. All materials, including Raags, notations, and teachings, are provided for personal learning and spiritual enrichment.',
    },
    {
      title: 'User Responsibilities',
      text: 'Users must not misuse the app or its content. Sharing, copying, or redistributing any teaching materials, audios, or notations without permission is strictly prohibited.',
    },
    {
      title: 'Intellectual Property Rights',
      text: 'All content available in the app, including text, Raag compositions, audio lessons, and visual elements, are the intellectual property of Raag Vidyalya. Unauthorized use or reproduction is not allowed.',
    },
    {
      title: 'Account and Data',
      text: 'If you create an account, you are responsible for maintaining its confidentiality. We take all reasonable steps to protect your data through secure storage (e.g., Firebase).',
    },
    {
      title: 'Limitation of Liability',
      text: 'Raag Vidyalya and its developers shall not be liable for any damages arising from the use or inability to use the app. All content is provided on an as-is basis for educational purposes only.',
    },
    {
      title: 'Third-Party Links and Services',
      text: 'Our app may include third-party services or links (such as Firebase, YouTube, or AdMob). We are not responsible for their content, data handling, or privacy policies.',
    },
    {
      title: 'Subscription & Payments',
      text: 'Some features of Raag Vidyalya may be offered as premium content or subscription-based services. All payments are handled securely through trusted platforms, and refunds are subject to respective policies.',
    },
    {
      title: 'Modifications to Terms',
      text: 'We may update these Terms & Conditions periodically. Continued use of the app after updates means you accept the revised terms.',
    },
    {
      title: 'Contact Us',
      text: 'For any concerns or clarifications regarding these terms, please contact us at: inderjeetsinghpbi@gmail.com',
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
          <FileText className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Terms & Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: October 2025
          </p>
        </div>
      </div>

      <p className="mb-8 text-xs font-medium text-foreground">
        Raag Vidyalya — an educational app dedicated to learning Gurmat Sangeet,
        focusing on the 31 Raags of Sri Guru Granth Sahib Ji.
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
    </div>
  );
}
