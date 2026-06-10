export interface User {
  id: string
  userName: string
  name: string
  email: string
  avatar?: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  image: string
  price: number
  rating: number
  enrolledCount: number
  modules: Module[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl?: string
  audioUrl?: string
}

export interface Raag {
  id: string
  name: string
  description: string
  thaat: string
  time: string
  mood: string
  aaroha: string
  avaroha: string
  pakad: string
  image: string
  audioUrl: string
  duration: string
  artist: string
}

export interface GurbaniItem {
  id: string
  title: string
  gurmukhi: string
  transliteration: string
  translation: string
  raag: string
  artist: string
  audioUrl: string
  duration: string
  image: string
}

export interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
}

export interface CartItem {
  product: StoreProduct
  quantity: number
}

export interface Contest {
  id: string
  title: string
  description: string
  prize: string
  deadline: string
  image: string
  participants: number
  status: 'upcoming' | 'active' | 'completed'
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  avatar: string
}
