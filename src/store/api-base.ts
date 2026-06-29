import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  API_BASE_URL,
  DEVICE_TYPE,
  MEDIA_BASE_URL,
  PROTECTED_ROUTES,
} from '@/lib/constants';
import {
  getYouTubeThumbnail,
  getGoogleDriveDirectUrl,
  getGoogleDriveAudioUrl,
} from '@/lib/video';
import { STORAGE_KEY, setUser, logout } from '@/store/authSlice';
import type {
  User,
  StoreProduct,
  VideoTutorial,
  Course,
  CourseVideo,
  GurbaniCollection,
  BandishItem,
  RaagApiItem,
  RaagsApiResponse,
  Transaction,
} from '@/types';
import { toast } from 'sonner';
import type {
  ProductApiItem,
  GurbaniApiResponse,
  ProductsApiResponse,
  VideoApiItem,
  TransactionApiItem,
  TransactionHistoryResponse,
  CollaboratorsApiResponse,
  BookmarkItem,
  BookmarksApiResponse,
  CourseVideoApiItem,
  CourseApiItem,
  CoursesApiResponse,
  EnrollmentProgress,
  EnrolledCourseApiItem,
  EnrollmentApiItem,
  EnrollmentsApiResponse,
  CourseDetailApiResponse,
  VideosApiResponse,
  UserDetailApiResponse,
  UserWithProductsApiResponse,
  ProductDetailApiResponse,
} from '@/types/api';

export { getYouTubeThumbnail as _getYouTubeThumbnail, getGoogleDriveAudioUrl as _getGoogleDriveAudioUrl };

export function resolveImageUrl(path: string): string {
  const driveUrl = getGoogleDriveDirectUrl(path);
  if (driveUrl !== path) return driveUrl;
  if (path.startsWith('/image/')) {
    const upstream = `${MEDIA_BASE_URL}${path}`;
    return `/api/proxy-image?url=${encodeURIComponent(upstream)}`;
  }
  if (path.startsWith('/')) {
    return `${MEDIA_BASE_URL}${path}`;
  }
  return path;
}

export function mapGurbaniCollection(
  raw: GurbaniCollection,
): GurbaniCollection {
  return {
    _id: raw._id,
    title: raw.title,
    titleGurmukhi: raw.titleGurmukhi,
    description: raw.description,
    baanis: (raw.baanis || []).map((b) => ({
      _id: b._id,
      title: b.title,
      gurmukhi: b.gurmukhi,
      transliteration: b.transliteration,
      translation: b.translation,
      audioUrl: b.audioUrl || '',
      pdfUrl: b.pdfUrl || '',
    })),
  };
}

function mapCourseBase(c: { id?: string; _id?: string; title: string; description: string; price: number; courseTypeName: string; category: string; level: string; thumbnail?: string; tags?: string[]; benefits?: string[]; prerequisites?: string[]; learningOutcomes?: string[]; enrollmentCount?: number; rating?: { average: number; count: number }; videoCount?: number; videos?: { _id: string; title: string; description: string; order: number; videoUrl: string }[]; isEnrolled?: boolean; access?: { canWatchFull?: boolean; requiresLogin?: boolean; requiresSubscriptionOrPurchase?: boolean }; collaborators?: { name?: string; profile?: string; email?: string; phoneNumber?: string; profession?: string } | null }, overrides: Partial<Course> = {}): Course {
  return {
    id: c.id || c._id || '',
    title: c.title,
    description: c.description,
    instructor: c.collaborators?.name || overrides.instructor || '',
    instructorAvatar: c.collaborators?.profile
      ? resolveImageUrl(c.collaborators.profile)
      : overrides.instructorAvatar as string | undefined,
    instructorEmail: c.collaborators?.email || overrides.instructorEmail,
    instructorPhone: c.collaborators?.phoneNumber || overrides.instructorPhone,
    instructorProfession: c.collaborators?.profession || overrides.instructorProfession,
    price: c.price,
    isFree: c.courseTypeName === 'free' || c.price === 0,
    category: c.category || 'General',
    level: c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : '',
    thumbnail: c.thumbnail ? resolveImageUrl(c.thumbnail) : undefined,
    tags: c.tags || [],
    benefits: c.benefits || [],
    prerequisites: c.prerequisites || [],
    learningOutcomes: c.learningOutcomes || [],
    enrollmentCount: c.enrollmentCount || 0,
    rating: c.rating?.average || 0,
    ratingCount: c.rating?.count || 0,
    videoCount: c.videoCount || 0,
    videos: (c.videos || []).map((v) => ({
      id: v._id,
      title: v.title,
      description: v.description,
      order: v.order,
      videoUrl: v.videoUrl,
    })),
    isEnrolled: c.isEnrolled || false,
    canWatchFull: c.access?.canWatchFull || false,
    requiresLogin: c.access?.requiresLogin || false,
    requiresSubscriptionOrPurchase:
      c.access?.requiresSubscriptionOrPurchase || false,
    courseTypeName: c.courseTypeName || '',
    ...overrides,
  };
}

export function mapCourse(c: CourseApiItem): Course {
  return mapCourseBase(c);
}

export function mapCourseFromEnrollment(c: EnrolledCourseApiItem): Course {
  return mapCourseBase(c, {
    instructor: '',
    instructorAvatar: undefined,
    instructorEmail: undefined,
    instructorPhone: undefined,
    instructorProfession: undefined,
    isEnrolled: true,
  });
}

export function emptyCourse(id: string): Course {
  return {
    id,
    title: '',
    description: '',
    instructor: '',
    instructorAvatar: undefined,
    instructorEmail: undefined,
    instructorPhone: undefined,
    instructorProfession: undefined,
    price: 0,
    isFree: false,
    category: 'General',
    level: '',
    thumbnail: undefined,
    tags: [],
    benefits: [],
    prerequisites: [],
    learningOutcomes: [],
    enrollmentCount: 0,
    rating: 0,
    ratingCount: 0,
    videoCount: 0,
    videos: [],
    isEnrolled: true,
    canWatchFull: false,
    requiresLogin: false,
    requiresSubscriptionOrPurchase: false,
    courseTypeName: '',
  };
}

export function mapEnrollment(e: EnrollmentApiItem) {
  const c = e.course;
  const course =
    c && typeof c === 'object'
      ? mapCourseFromEnrollment(c)
      : emptyCourse(typeof c === 'string' ? c : e._id);
  return {
    _id: e._id,
    user: e.user,
    course,
    progress: e.progress || {
      completedLessonOrders: [],
      completionPercentage: 0,
      lastAccessedAt: '',
    },
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

export function mapProduct(p: ProductApiItem): StoreProduct {
  return {
    id: p._id,
    name: p.name,
    description: p.description,
    price: p.discountPrice || p.price,
    originalPrice: p.price > p.discountPrice ? p.price : undefined,
    images: (p.images || []).map(resolveImageUrl),
    category: p.category?.name || 'General',
    tags: p.tags?.length ? p.tags : undefined,
    sellerName: p.user?.userName,
    sellerAvatar: p.user?.profileImage
      ? resolveImageUrl(p.user.profileImage)
      : undefined,
    sellerPhone: p.user?.phoneNumber,
    sellerCountryCode: p.user?.countryCode,
    sellerEmail: p.user?.email,
    sellerRole: p.user?.roleName,
    sellerUserId: p.user?._id,
  };
}

function extractAuthResponse(
  response: Record<string, unknown>,
): { user: User; token: string; refreshToken: string } | null {
  const tryGet = (paths: string[][]): unknown | undefined => {
    for (const path of paths) {
      let val: unknown = response;
      for (const key of path) {
        if (val && typeof val === 'object' && key in val) {
          val = (val as Record<string, unknown>)[key];
        } else {
          val = undefined;
          break;
        }
      }
      if (val !== undefined && val !== null) return val;
    }
    return undefined;
  };

  const token = tryGet([
    ['token'],
    ['access_token'],
    ['user', 'access_token'],
    ['user', 'token'],
    ['data', 'access_token'],
    ['data', 'token'],
  ]) as string | undefined;

  const refreshToken = tryGet([
    ['refreshToken'],
    ['refresh_token'],
    ['user', 'refresh_token'],
    ['user', 'refreshToken'],
    ['data', 'refresh_token'],
    ['data', 'refreshToken'],
  ]) as string | undefined;

  const user = tryGet([['user'], ['data'], ['data', 'user']]) as
    | User
    | undefined;

  if (!token || !user) return null;

  if (user.userName && !user.name) {
    user.name = user.userName;
  }

  const rawUser = user as unknown as Record<string, unknown>;
  if (!user.id && rawUser._id) {
    rawUser.id = rawUser._id as string;
  }

  const { access_token, refresh_token, ...cleanUser } =
    user as User & { access_token?: string; refresh_token?: string };
  return { user: cleanUser, token, refreshToken: refreshToken || '' };
}

export { extractAuthResponse };

function resolveBaseUrl(url: string) {
  return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
}

function resolveArgs(args: string | FetchArgs): string | FetchArgs {
  if (typeof args === 'string') return resolveBaseUrl(args);
  return { ...args, url: resolveBaseUrl(args.url) };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const raw =
        sessionStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const state = JSON.parse(raw);
          if (state.token) {
            headers.set('Authorization', `Bearer ${state.token}`);
          }
        } catch {
        }
      }
    }
    return headers;
  },
});

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => {
    const regex = new RegExp(
      '^' + route.replace(/\[.*?\]/g, '[^/]+') + '$',
    );
    return regex.test(pathname);
  });
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(
    resolveArgs(args),
    api,
    extraOptions,
  );
  if (result.error?.status === 401) {
    if (typeof window !== 'undefined') {
      const raw =
        sessionStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const state = JSON.parse(raw);
          if (state.refreshToken) {
            const refreshResult = await rawBaseQuery(
              resolveArgs({
                url: '/user/refresh-token',
                method: 'POST',
                body: { refreshToken: state.refreshToken },
              }),
              api,
              extraOptions,
            );
            if (refreshResult.data) {
              const refreshed = extractAuthResponse(
                refreshResult.data as Record<string, unknown>,
              );
              if (refreshed) {
                const newState = {
                  ...state,
                  token: refreshed.token,
                  refreshToken: refreshed.refreshToken,
                };
                const isSession =
                  !!sessionStorage.getItem(STORAGE_KEY);
                const serialized = JSON.stringify(newState);
                if (isSession) {
                  sessionStorage.setItem(STORAGE_KEY, serialized);
                } else {
                  localStorage.setItem(STORAGE_KEY, serialized);
                }
                return rawBaseQuery(
                  resolveArgs(args),
                  api,
                  extraOptions,
                );
              }
            }
          }
          console.warn(
            '[api] 401 — token refresh failed or no refresh token',
            state,
          );
        } catch {
        }
      }
      toast.error('Unauthorized, please login to continue');
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      api.dispatch(logout());
      const currentPath = window.location.pathname;
      if (isProtectedRoute(currentPath)) {
        window.location.replace(
          '/login?redirectTo=' + encodeURIComponent(currentPath),
        );
      }
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Product',
    'Video',
    'Course',
    'Gurbani',
    'Raag',
    'Enrollment',
    'Bookmark',
    'Collaborator',
    'Referral',
    'Subscription',
  ],
  endpoints: () => ({}),
});
