export interface User {
  id: string;
  userName: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  gender?: string;
  age?: number;
  phoneNumber?: string;
  countryCode?: string;
  hasPassword?: boolean;
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  videoUrl: string;
  instructor?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  instructorEmail?: string;
  instructorPhone?: string;
  instructorProfession?: string;
  price: number;
  isFree: boolean;
  category: string;
  level: string;
  thumbnail?: string;
  tags: string[];
  benefits: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  videoCount: number;
  videos: CourseVideo[];
  isEnrolled: boolean;
  canWatchFull: boolean;
  requiresLogin: boolean;
  requiresSubscriptionOrPurchase: boolean;
  courseTypeName: string;
}

export interface CourseVideo {
  id: string;
  title: string;
  description: string;
  order: number;
  videoUrl: string;
}

export interface Raag {
  id: string;
  name: string;
  description: string;
  thaat: string;
  time: string;
  mood: string;
  aaroha: string;
  avaroha: string;
  pakad: string;
  image: string;
  audioUrl: string;
  duration: string;
  artist: string;
}

export interface GurbaniBaani {
  _id: string;
  title: string;
  gurmukhi?: string;
  transliteration?: string;
  translation?: string;
  audioUrl: string;
  pdfUrl: string;
}

export interface GurbaniCollection {
  _id: string;
  title: string;
  titleGurmukhi?: string;
  description: string;
  baanis: GurbaniBaani[];
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags?: string[];
  sellerName?: string;
  sellerAvatar?: string;
  sellerPhone?: string;
  sellerCountryCode?: string;
  sellerEmail?: string;
  sellerRole?: string;
  sellerUserId?: string;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  prize: string;
  deadline: string;
  image: string;
  participants: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface BandishItem {
  sId: number;
  bandishName: string;
  pdfUrl: string | null;
  audioUrl: string | null;
}

export interface RaagApiItem {
  _id: string;
  id: number;
  name: string;
  thaat: string;
  sur: string;
  wargitSur: string | null;
  jaati: string;
  time: string;
  vaadi: string;
  samvadi: string;
  aroh: string;
  avroh: string;
  audioUrl: string | null;
  listOfBandish: BandishItem[];
}

export interface RaagsApiResponse {
  success: boolean;
  message: string;
  raags: RaagApiItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  title: string;
  description: string;
  referenceId: string | null;
  referenceModel: string | null;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface ContentItem {
  _id: string;
  title: string;
  url: string;
  description?: string;
  order: number;
}

export interface Section {
  _id: string;
  title: string;
  description?: string;
  content: ContentItem[];
}

export interface PreviousResult {
  _id: string
  title: string
  description: string
  videoUrl: string
  createdAt: string
  updatedAt: string
}

export interface PreviousResultsApiResponse {
  success: boolean
  message: string
  previousResults: PreviousResult[]
  total: number
  page: number
  totalPages: number
}

export interface CheckDeviceResponse {
  success: boolean
  deviceUsed: boolean
  message: string
}

export interface ReferralCodeResponse {
  success: boolean
  message: string
  referralCode: string
  referralCodeGeneratedAt: string
  shareText: string
}

export interface ReferralHistoryStats {
  total: number
  successful: number
  pending: number
  failed: number
  raagUnlockCount: number
  referralsToNextUnlock: number
  nextRaagNumber: number
  allRaagsUnlocked: boolean
}

export interface ReferralHistoryResponse {
  success: boolean
  message: string
  referrals: unknown[]
  total: number
  page: number
  totalPages: number
  stats: ReferralHistoryStats
}

export interface RaagAccessItem {
  raagNumber: number
  raagName?: string
  isUnlocked?: boolean
  unlockedAt?: string | null
  expiresAt?: string | null
}

export interface RaagAccessResponse {
  success: boolean
  message: string
  raagAccess: RaagAccessItem[]
  totalActiveUnlocks: number
}

export interface SingleRaagAccessResponse {
  success: boolean
  message: string
  hasAccess: boolean
  raagNumber: number
  unlockedAt: string | null
  expiresAt: string | null
  isFree: boolean
}




export interface Collaborator {
  _id: string;
  name: string;
  profile?: string;
  coverProfile?: string;
  email?: string;
  phoneNumber?: string;
  profession?: string;
  professionValue?: string;
  bio?: string;
  sectionCount?: number;
  sections?: Section[];
  address?: string;
}
