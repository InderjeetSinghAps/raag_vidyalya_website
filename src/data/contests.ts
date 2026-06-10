import { Contest, Testimonial } from '@/types';

export const contests: Contest[] = [
  {
    id: 'c1',
    title: 'Shabad Kirtan Competition',
    description:
      'Showcase your Kirtan skills and win exciting prizes. Open to all levels.',
    prize: '₹50,000 + Harmonium',
    deadline: '2026-07-15',
    image: '/contests/kirtan.jpg',
    participants: 234,
    status: 'active',
  },
  {
    id: 'c2',
    title: 'Raag Identification Challenge',
    description:
      'Identify raags played in short audio clips. Test your ear training!',
    prize: '₹10,000',
    deadline: '2026-08-01',
    image: '/contests/raag-id.jpg',
    participants: 567,
    status: 'active',
  },
  {
    id: 'c3',
    title: 'Gurbani Recitation',
    description:
      'Recite Gurbani with correct pronunciation and melody for a chance to be featured.',
    prize: '₹25,000 + Feature on App',
    deadline: '2026-06-30',
    image: '/contests/recitation.jpg',
    participants: 189,
    status: 'upcoming',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amritpal Singh',
    text: 'Raag Vidyalaya has transformed my understanding of Gurmat Sangeet. The structured courses are amazing!',
    rating: 5,
    avatar: '/testimonials/user1.jpg',
  },
  {
    id: 't2',
    name: 'Simran Kaur',
    text: 'I never knew I could learn Kirtan online. The teachers are world-class and the community is supportive.',
    rating: 5,
    avatar: '/testimonials/user2.jpg',
  },
  {
    id: 't3',
    name: 'Gurpreet Singh',
    text: 'The raag library is incredible. Having access to so many authentic recordings helps my practice immensely.',
    rating: 4,
    avatar: '/testimonials/user3.jpg',
  },
];
