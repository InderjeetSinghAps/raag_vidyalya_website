export interface User {
  id: string
  userName: string
  name: string
  email: string
  avatar?: string
  profileImage?: string
  gender?: string
  age?: number
  phoneNumber?: string
  countryCode?: string
  hasPassword?: boolean
}

export interface VideoTutorial {
  id: string
  title: string
  description: string
  thumbnail?: string
  duration?: string
  videoUrl: string
  instructor?: string
  createdAt: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar?: string
  instructorEmail?: string
  instructorPhone?: string
  instructorProfession?: string
  price: number
  isFree: boolean
  category: string
  level: string
  thumbnail?: string
  tags: string[]
  benefits: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  enrollmentCount: number
  rating: number
  ratingCount: number
  videoCount: number
  videos: CourseVideo[]
  isEnrolled: boolean
  canWatchFull: boolean
  requiresLogin: boolean
  requiresSubscriptionOrPurchase: boolean
  courseTypeName: string
}

export interface CourseVideo {
  id: string
  title: string
  description: string
  order: number
  videoUrl: string
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

export interface GurbaniBaani {
  _id: string
  title: string
  gurmukhi?: string
  transliteration?: string
  translation?: string
  audioUrl: string
  pdfUrl: string
}

export interface GurbaniCollection {
  _id: string
  title: string
  titleGurmukhi?: string
  description: string
  baanis: GurbaniBaani[]
}

export interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags?: string[]
  sellerName?: string
  sellerAvatar?: string
  sellerPhone?: string
  sellerCountryCode?: string
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

export interface BandishItem {
  sId: number
  bandishName: string
  pdfUrl: string | null
  audioUrl: string | null
}

export interface RaagApiItem {
  _id: string
  id: number
  name: string
  thaat: string
  sur: string
  wargitSur: string | null
  jaati: string
  time: string
  vaadi: string
  samvadi: string
  aroh: string
  avroh: string
  audioUrl: string | null
  listOfBandish: BandishItem[]
}

export interface RaagsApiResponse {
  success: boolean
  message: string
  raags: RaagApiItem[]
  total: number
  page: number
  totalPages: number
}

export interface Testimonial {
  id: string
  name: string
  text: string
  rating: number
  avatar: string
}
