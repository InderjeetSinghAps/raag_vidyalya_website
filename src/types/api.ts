import type { GurbaniCollection, User, Collaborator } from '.';

export interface ProductApiItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: { _id: string; name: string };
  stock: number;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    userName: string;
    email?: string;
    profileImage?: string;
    phoneNumber?: string;
    countryCode?: string;
    role?: number;
    roleName?: string;
  };
}

export interface GurbaniApiResponse {
  success: boolean;
  message: string;
  gurbani: GurbaniCollection[];
  total: number;
  totalPages: number;
  page: number;
}

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  products: ProductApiItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductDetailApiResponse {
  success: boolean;
  message: string;
  product: ProductApiItem;
}

export interface UserDetailApiResponse {
  success: boolean;
  message: string;
  user: User;
  todayTip: string;
}

export interface UserWithProductsApiResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    userName: string;
    email: string;
    role: number;
    phoneNumber: string;
    countryCode: string;
    age: number;
    gender: number;
    isOtpVerified: boolean;
    isVerified: boolean;
    language: string;
    createdAt: string;
    updatedAt: string;
    profileImage?: string;
    roleName: string;
    genderName: string;
    deviceTypeName: string | null;
  };
  products: ProductApiItem[];
  productsTotal: number;
}

export interface VideoApiItem {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  videoUrl: string;
  instructor?: string;
  createdAt: string;
}

export interface TransactionApiItem {
  _id: string;
  userId: string;
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
  updatedAt: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  message: string;
  transactions: TransactionApiItem[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

export interface CollaboratorsApiResponse {
  success: boolean;
  message: string;
  collaborators: Collaborator[];
  total: number;
}

export interface BookmarkItem {
  _id: string;
  userId: string;
  title: string;
  videoUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarksApiResponse {
  success: boolean;
  message: string;
  bookmarks: BookmarkItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CourseVideoApiItem {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseApiItem {
  _id: string;
  title: string;
  description: string;
  courseType: number;
  price: number;
  category: string;
  thumbnail: string;
  level: string;
  tags: string[];
  benefits: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  enrollmentCount: number;
  rating: { average: number; count: number };
  videoCount: number;
  videos: CourseVideoApiItem[];
  collaborators: {
    _id: string;
    name: string;
    profile?: string;
    coverProfile?: string;
    email?: string;
    phoneNumber?: string;
    profession?: string;
  };
  isEnrolled: boolean;
  courseTypeName: string;
  access: {
    canWatchFull: boolean;
    requiresLogin: boolean;
    requiresSubscriptionOrPurchase: boolean;
  };
}

export interface CoursesApiResponse {
  success: boolean;
  message: string;
  courses: CourseApiItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCourses: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  totalVideosOnPage: number;
}

export interface EnrollmentProgress {
  completedLessonOrders: number[];
  completionPercentage: number;
  lastAccessedAt: string;
}

export interface EnrolledCourseApiItem {
  _id: string;
  title: string;
  description: string;
  courseType: number;
  price: number;
  category: string;
  thumbnail: string;
  level: string;
  tags: string[];
  benefits: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  enrollmentCount: number;
  rating: { average: number; count: number };
  videoCount: number;
  videosCount: number;
  videos: CourseVideoApiItem[];
  isEnrolled: boolean;
  courseTypeName: string;
  access: {
    canWatchFull: boolean;
    requiresLogin: boolean;
    requiresSubscriptionOrPurchase: boolean;
  };
}

export interface EnrollmentApiItem {
  _id: string;
  user: string;
  course: EnrolledCourseApiItem;
  progress: EnrollmentProgress;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentsApiResponse {
  success: boolean;
  message: string;
  enrollments: EnrollmentApiItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CourseDetailApiResponse {
  success: boolean;
  message: string;
  course: CourseApiItem;
}

export interface VideosApiResponse {
  success: boolean;
  message: string;
  videos: VideoApiItem[];
  total: number;
  page: number;
  totalPages: number;
}
