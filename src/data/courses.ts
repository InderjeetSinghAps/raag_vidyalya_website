import { Course } from '@/types'

export const courses: Course[] = [
  {
    id: 'gurmat-sangeet-basics',
    title: 'Gurmat Sangeet Basics',
    description: 'Learn the fundamental principles of Gurmat Sangeet, including Shabad Kirtan, Raag terminology, and traditional singing techniques.',
    instructor: 'Bhai Harjinder Singh',
    duration: '12 weeks',
    level: 'Beginner',
    image: '/courses/gurmat-basics.jpg',
    price: 1999,
    rating: 4.8,
    enrolledCount: 1240,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Gurmat Sangeet',
        lessons: [
          { id: 'l1', title: 'History & Origins', duration: '15 min' },
          { id: 'l2', title: 'Role in Sikhism', duration: '12 min' },
          { id: 'l3', title: 'Key Terminology', duration: '20 min' },
        ],
      },
      {
        id: 'm2',
        title: 'Voice Culture',
        lessons: [
          { id: 'l4', title: 'Breathing Exercises', duration: '25 min' },
          { id: 'l5', title: 'Pitch Control', duration: '20 min' },
          { id: 'l6', title: 'Voice Projection', duration: '18 min' },
        ],
      },
    ],
  },
  {
    id: 'raag-bilaval',
    title: 'Raag Bilaval',
    description: 'Deep dive into Raag Bilaval — its structure, compositions, and performance techniques.',
    instructor: 'Dr. Gurnam Singh',
    duration: '8 weeks',
    level: 'Intermediate',
    image: '/courses/raag-bilaval.jpg',
    price: 2499,
    rating: 4.9,
    enrolledCount: 876,
    modules: [
      {
        id: 'm1',
        title: 'Raag Structure',
        lessons: [
          { id: 'l1', title: 'Aaroha & Avaroha', duration: '20 min' },
          { id: 'l2', title: 'Pakad & Vadi-Samvadi', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: 'kirtan-advanced',
    title: 'Advanced Kirtan',
    description: 'Master advanced Kirtan styles including Gurmat Sangeet Raag forms and Taal variations.',
    instructor: 'Bhai Kultar Singh',
    duration: '16 weeks',
    level: 'Advanced',
    image: '/courses/advanced-kirtan.jpg',
    price: 3999,
    rating: 4.7,
    enrolledCount: 543,
    modules: [
      {
        id: 'm1',
        title: 'Advanced Raags',
        lessons: [
          { id: 'l1', title: 'Raag Deepak', duration: '30 min' },
          { id: 'l2', title: 'Raag Megh', duration: '25 min' },
        ],
      },
    ],
  },
  {
    id: 'taal-laya',
    title: 'Taal & Laya',
    description: 'Understand the rhythmic cycles in Gurmat Sangeet — Teen Taal, Ek Taal, Jhap Taal, and more.',
    instructor: 'Ustad Ranjit Singh',
    duration: '10 weeks',
    level: 'Intermediate',
    image: '/courses/taal-laya.jpg',
    price: 2199,
    rating: 4.6,
    enrolledCount: 654,
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Taal',
        lessons: [
          { id: 'l1', title: 'What is Taal?', duration: '15 min' },
          { id: 'l2', title: 'Teen Taal', duration: '20 min' },
        ],
      },
    ],
  },
]
