import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL, DEVICE_TYPE, MEDIA_BASE_URL } from '@/lib/constants'
import { getYouTubeThumbnail, getGoogleDriveDirectUrl, getGoogleDriveAudioUrl } from '@/lib/video'
import { STORAGE_KEY, setUser, logout } from '@/store/authSlice'
import type { User, StoreProduct, VideoTutorial, Course, CourseVideo, GurbaniCollection, BandishItem, RaagApiItem, RaagsApiResponse, Transaction } from '@/types'
import { toast } from 'sonner'

interface ProductApiItem {
  _id: string
  name: string
  description: string
  price: number
  discountPrice: number
  images: string[]
  category: { _id: string; name: string }
  stock: number
  tags: string[]
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  user: { _id: string; userName: string; email?: string; profileImage?: string; phoneNumber?: string; countryCode?: string; role?: number; roleName?: string }
}

interface GurbaniApiResponse {
  success: boolean
  message: string
  gurbani: GurbaniCollection[]
  total: number
  totalPages: number
  page: number
}

function mapGurbaniCollection(raw: GurbaniCollection): GurbaniCollection {
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
  }
}

interface ProductsApiResponse {
  success: boolean
  message: string
  products: ProductApiItem[]
  total: number
  page: number
  totalPages: number
}

interface ProductDetailApiResponse {
  success: boolean
  message: string
  product: ProductApiItem
}

interface UserDetailApiResponse {
  success: boolean
  message: string
  user: User
  todayTip: string
}

interface UserWithProductsApiResponse {
  success: boolean
  message: string
  user: {
    _id: string
    userName: string
    email: string
    role: number
    phoneNumber: string
    countryCode: string
    age: number
    gender: number
    isOtpVerified: boolean
    isVerified: boolean
    language: string
    createdAt: string
    updatedAt: string
    profileImage?: string
    roleName: string
    genderName: string
    deviceTypeName: string | null
  }
  products: ProductApiItem[]
  productsTotal: number
}

interface VideoApiItem {
  _id: string
  title: string
  description: string
  thumbnail?: string
  duration?: string
  videoUrl: string
  instructor?: string
  createdAt: string
}

// Bookmark related types
interface TransactionApiItem {
  _id: string
  userId: string
  type: 'credit' | 'debit'
  amount: number
  reason: string
  title: string
  description: string
  referenceId: string | null
  referenceModel: string | null
  balanceBefore: number
  balanceAfter: number
  createdAt: string
  updatedAt: string
}

interface TransactionHistoryResponse {
  success: boolean
  message: string
  transactions: TransactionApiItem[]
  total: number
  page: number
  totalPages: number
  pageSize: number
}

interface CollaboratorsApiResponse {
  success: boolean
  message: string
  collaborators: import('@/types').Collaborator[]
  total: number
}

interface BookmarkItem {
  _id: string
  userId: string
  title: string
  videoUrl: string
  description: string
  createdAt: string
  updatedAt: string
}

interface BookmarksApiResponse {
  success: boolean
  message: string
  bookmarks: BookmarkItem[]
  total: number
  page: number
  totalPages: number
}

interface CourseVideoApiItem {
  _id: string
  courseId: string
  title: string
  description: string
  order: number
  videoUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CourseApiItem {
  _id: string
  title: string
  description: string
  courseType: number
  price: number
  category: string
  thumbnail: string
  level: string
  tags: string[]
  benefits: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  enrollmentCount: number
  rating: { average: number; count: number }
  videoCount: number
  videos: CourseVideoApiItem[]
  collaborators: {
    _id: string
    name: string
    profile?: string
    coverProfile?: string
    email?: string
    phoneNumber?: string
    profession?: string
  }
  isEnrolled: boolean
  courseTypeName: string
  access: { canWatchFull: boolean; requiresLogin: boolean; requiresSubscriptionOrPurchase: boolean }
}

interface CoursesApiResponse {
  success: boolean
  message: string
  courses: CourseApiItem[]
  pagination: { currentPage: number; pageSize: number; totalPages: number; totalCourses: number; hasNextPage: boolean; hasPrevPage: boolean }
  totalVideosOnPage: number
}

interface EnrollmentProgress {
  completedLessonOrders: number[]
  completionPercentage: number
  lastAccessedAt: string
}

interface EnrolledCourseApiItem {
  _id: string
  title: string
  description: string
  courseType: number
  price: number
  category: string
  thumbnail: string
  level: string
  tags: string[]
  benefits: string[]
  prerequisites: string[]
  learningOutcomes: string[]
  enrollmentCount: number
  rating: { average: number; count: number }
  videoCount: number
  videosCount: number
  videos: CourseVideoApiItem[]
  isEnrolled: boolean
  courseTypeName: string
  access: { canWatchFull: boolean; requiresLogin: boolean; requiresSubscriptionOrPurchase: boolean }
}

interface EnrollmentApiItem {
  _id: string
  user: string
  course: EnrolledCourseApiItem
  progress: EnrollmentProgress
  createdAt: string
  updatedAt: string
}

interface EnrollmentsApiResponse {
  success: boolean
  message: string
  enrollments: EnrollmentApiItem[]
  total: number
  page: number
  totalPages: number
}

interface CourseDetailApiResponse {
  success: boolean
  message: string
  course: CourseApiItem
}

interface VideosApiResponse {
  success: boolean
  message: string
  videos: VideoApiItem[]
  total: number
  page: number
  totalPages: number
}

export function resolveImageUrl(path: string): string {
  const driveUrl = getGoogleDriveDirectUrl(path)
  if (driveUrl !== path) return driveUrl
  if (path.startsWith('/image/')) {
    const upstream = `${MEDIA_BASE_URL}${path}`
    return `/api/proxy-image?url=${encodeURIComponent(upstream)}`
  }
  if (path.startsWith('/')) {
    return `${MEDIA_BASE_URL}${path}`
  }
  return path
}

function mapCourse(c: CourseApiItem): Course {
  return {
    id: c._id,
    title: c.title,
    description: c.description,
    instructor: c.collaborators?.name || '',
    instructorAvatar: c.collaborators?.profile ? resolveImageUrl(c.collaborators.profile) : undefined,
    instructorEmail: c.collaborators?.email,
    instructorPhone: c.collaborators?.phoneNumber,
    instructorProfession: c.collaborators?.profession,
    price: c.price,
    isFree: c.courseTypeName === 'free' || c.price === 0,
    category: c.category || 'General',
    level: c.level.charAt(0).toUpperCase() + c.level.slice(1),
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
    requiresSubscriptionOrPurchase: c.access?.requiresSubscriptionOrPurchase || false,
    courseTypeName: c.courseTypeName || '',
  }
}

function mapCourseFromEnrollment(c: EnrolledCourseApiItem): Course {
  return {
    id: c._id,
    title: c.title,
    description: c.description,
    instructor: '',
    instructorAvatar: undefined as string | undefined,
    instructorEmail: undefined,
    instructorPhone: undefined,
    instructorProfession: undefined,
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
    isEnrolled: true,
    canWatchFull: c.access?.canWatchFull || false,
    requiresLogin: c.access?.requiresLogin || false,
    requiresSubscriptionOrPurchase: c.access?.requiresSubscriptionOrPurchase || false,
    courseTypeName: c.courseTypeName || '',
  }
}

function emptyCourse(id: string): Course {
  return {
    id, title: '', description: '', instructor: '',
    instructorAvatar: undefined, instructorEmail: undefined,
    instructorPhone: undefined, instructorProfession: undefined,
    price: 0, isFree: false, category: 'General', level: '',
    thumbnail: undefined, tags: [], benefits: [], prerequisites: [],
    learningOutcomes: [], enrollmentCount: 0, rating: 0, ratingCount: 0,
    videoCount: 0, videos: [], isEnrolled: true, canWatchFull: false,
    requiresLogin: false, requiresSubscriptionOrPurchase: false,
    courseTypeName: '',
  }
}

function mapEnrollment(e: EnrollmentApiItem) {
  const c = e.course
  const course = c && typeof c === 'object'
    ? mapCourseFromEnrollment(c)
    : emptyCourse(typeof c === 'string' ? c : e._id)
  return {
    _id: e._id,
    user: e.user,
    course,
    progress: e.progress || { completedLessonOrders: [], completionPercentage: 0, lastAccessedAt: '' },
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  }
}

function mapProduct(p: ProductApiItem): StoreProduct {
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
    sellerAvatar: p.user?.profileImage ? resolveImageUrl(p.user.profileImage) : undefined,
    sellerPhone: p.user?.phoneNumber,
    sellerCountryCode: p.user?.countryCode,
    sellerEmail: p.user?.email,
    sellerRole: p.user?.roleName,
    sellerUserId: p.user?._id,
  }
}

function extractAuthResponse(
  response: Record<string, unknown>,
): { user: User; token: string; refreshToken: string } | null {
  const tryGet = (paths: string[][]): unknown | undefined => {
    for (const path of paths) {
      let val: unknown = response
      for (const key of path) {
        if (val && typeof val === 'object' && key in val) {
          val = (val as Record<string, unknown>)[key]
        } else {
          val = undefined
          break
        }
      }
      if (val !== undefined && val !== null) return val
    }
    return undefined
  }

  const token = tryGet([
    ['token'],
    ['access_token'],
    ['user', 'access_token'],
    ['user', 'token'],
    ['data', 'access_token'],
    ['data', 'token'],
  ]) as string | undefined

  const refreshToken = tryGet([
    ['refreshToken'],
    ['refresh_token'],
    ['user', 'refresh_token'],
    ['user', 'refreshToken'],
    ['data', 'refresh_token'],
    ['data', 'refreshToken'],
  ]) as string | undefined

  const user = tryGet([
    ['user'],
    ['data'],
    ['data', 'user'],
  ]) as User | undefined

  if (!token || !user) return null

  if (user.userName && !user.name) {
    user.name = user.userName
  }

  const { access_token, refresh_token, ...cleanUser } = user as User & { access_token?: string; refresh_token?: string }
  return { user: cleanUser, token, refreshToken: refreshToken || '' }
}

function resolveBaseUrl(url: string) {
  return `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`
}

function resolveArgs(args: string | FetchArgs): string | FetchArgs {
  if (typeof args === 'string') return resolveBaseUrl(args)
  return { ...args, url: resolveBaseUrl(args.url) }
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const state = JSON.parse(raw)
          if (state.token) {
            headers.set('Authorization', `Bearer ${state.token}`)
          }
        } catch {
          /* ignore */
        }
      }
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(resolveArgs(args), api, extraOptions)
  if (result.error?.status === 401) {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const state = JSON.parse(raw)
          if (state.refreshToken) {
            const refreshResult = await rawBaseQuery(
              resolveArgs({
                url: '/user/refresh-token',
                method: 'POST',
                body: { refreshToken: state.refreshToken },
              }),
              api,
              extraOptions,
            )
            if (refreshResult.data) {
              const refreshed = extractAuthResponse(refreshResult.data as Record<string, unknown>)
              if (refreshed) {
                const newState = { ...state, token: refreshed.token, refreshToken: refreshed.refreshToken }
                const isSession = !!sessionStorage.getItem(STORAGE_KEY)
                const serialized = JSON.stringify(newState)
                if (isSession) {
                  sessionStorage.setItem(STORAGE_KEY, serialized)
                } else {
                  localStorage.setItem(STORAGE_KEY, serialized)
                }
                return rawBaseQuery(resolveArgs(args), api, extraOptions)
              }
            }
          }
          console.warn('[api] 401 — token refresh failed or no refresh token', state)
        } catch {
          /* fall through to redirect */
        }
      }
      toast.error('Unauthorized, please login to continue')
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
      api.dispatch(logout())
      window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.pathname))
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Video', 'Course', 'Gurbani', 'Raag', 'Enrollment', 'Bookmark', 'Collaborator', 'Referral'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; token: string; refreshToken: string },
      { email: string; password: string; rememberMe?: boolean; deviceToken?: string; deviceType?: number }
    >({
  query: ({ email, password, deviceToken = 'NA', deviceType = DEVICE_TYPE }) => ({
    url: '/user/user-login',
    method: 'POST',
    body: { email, password, deviceToken, deviceType },
  }),
  transformResponse: (response) => {
    const result = extractAuthResponse(response as Record<string, unknown>)
    if (!result) throw new Error('Login response missing token or user')
    return result
  },
  async onQueryStarted({ rememberMe }, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled
      dispatch(setUser({ user: data.user, token: data.token, refreshToken: data.refreshToken, rememberMe: rememberMe ?? true }))
    } catch {
      /* error handled by caller */
    }
  },
    }),

signup: builder.mutation<
  { success: boolean; message: string; email: string },
  {
    email: string
    password: string
    userName: string
    deviceType: number
    deviceToken: string
    deviceId: string
    referralCode?: string
    phoneNumber?: string
    countryCode?: string
    language?: string
  }
>({
  query: (body) => ({
    url: '/user/user-register',
    method: 'POST',
    body: { ...body, age: 0 },
  }),
}),

    verifyOtp: builder.mutation<
      {
        user: User
        token: string
        refreshToken: string
        referralCode?: string
        raagUnlockedForReferrer?: {
          raagUnlocked: boolean
          raagNumber: number
          expiresAt: string
        }
      },
      { email: string; otp: string; type?: 1 | 2 }
    >({
      query: ({ email, otp, type = 1 }) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body: { email, otp, type },
      }),
      transformResponse: (response) => {
        const raw = response as Record<string, unknown>
        const result = extractAuthResponse(raw)
        if (!result) throw new Error('Verify OTP response missing token or user')
        return {
          ...result,
          referralCode: raw.referralCode as string | undefined,
          raagUnlockedForReferrer: raw.raagUnlockedForReferrer as
            | { raagUnlocked: boolean; raagNumber: number; expiresAt: string }
            | undefined,
        }
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser({ user: data.user, token: data.token, refreshToken: data.refreshToken, rememberMe: true }))
        } catch {
          /* error handled by caller */
        }
      },
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/user/forget-password',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<void, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/user/reset-password',
        method: 'POST',
        body: { email, password },
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/user/user-logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch {
          /* still clear local state */
        } finally {
          dispatch(logout())
        }
      },
    }),

    socialLogin: builder.mutation<
      { user: User; token: string; refreshToken: string },
      {
        email: string
        provider: string
        providerId: string
        firstName: string
        profileImage?: string
        deviceType?: number
        deviceToken?: string
      }
    >({
      query: (body) => ({
        url: '/user/social-login',
        method: 'POST',
        body: { ...body, deviceType: body.deviceType ?? DEVICE_TYPE, deviceToken: body.deviceToken ?? 'NA' },
      }),
      transformResponse: (response) => {
        const result = extractAuthResponse(response as Record<string, unknown>)
        if (!result) throw new Error('Social login response missing token or user')
        return result
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser({ user: data.user, token: data.token, refreshToken: data.refreshToken, rememberMe: true }))
        } catch {
          /* error handled by caller */
        }
      },
    }),

    getUserDetail: builder.query<User, void>({
      query: () => '/user/user-detail',
      transformResponse: (response: UserDetailApiResponse) => response.user,
      providesTags: ['User'],
    }),

    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
      query: ({ oldPassword, newPassword }) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: { oldPassword, newPassword },
      }),
    }),

    setPassword: builder.mutation<void, { newPassword: string }>({
      query: ({ newPassword }) => ({
        url: '/user/set-password',
        method: 'POST',
        body: { newPassword },
      }),
    }),

    updateUser: builder.mutation<
      void,
      {
        userName?: string
        gender?: string
        age?: number
        phoneNumber?: string
        countryCode?: string
        profileImage?: string
      }
    >({
      query: (body) => ({
        url: '/user/user-update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled
          const state = getState() as unknown as { auth: { user: User | null; token: string | null; refreshToken: string | null } }
          const { token, refreshToken } = state.auth
          const result = await dispatch(api.endpoints.getUserDetail.initiate(undefined, { forceRefetch: true }))
          if (result.data && token) {
            dispatch(setUser({ user: result.data, token, refreshToken: refreshToken || '' }))
          }
        } catch {
        }
      },
    }),

    getProducts: builder.query<
      { products: StoreProduct[]; total: number; totalPages: number; page: number },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params: Record<string, string | number> = { page, limit }
        if (search) params.search = search
        return { url: '/product', params }
      },
      transformResponse: (response: ProductsApiResponse) => ({
        products: response.products.map(mapProduct),
        total: response.total,
        totalPages: response.totalPages,
        page: response.page,
      }),
      providesTags: ['Product'],
    }),

    getProductById: builder.query<StoreProduct | null, string>({
      query: (id) => ({ url: `/product/${id}` }),
      transformResponse: (response: ProductDetailApiResponse) =>
        response.product ? mapProduct(response.product) : null,
      providesTags: ['Product'],
    }),

    getUserWithProducts: builder.query<
      { user: { id: string; userName: string; email: string; profileImage: string; phoneNumber: string; countryCode: string; roleName: string; isVerified: boolean; verifiedIcon: string; createdAt: string }; products: StoreProduct[]; productsTotal: number },
      string
    >({
      query: (id) => ({ url: `/user/${id}/with-products` }),
      transformResponse: (response: UserWithProductsApiResponse) => ({
        user: {
          id: response.user._id,
          userName: response.user.userName,
          email: response.user.email,
          profileImage: resolveImageUrl(response.user.profileImage || ''),
          phoneNumber: response.user.phoneNumber,
          countryCode: response.user.countryCode,
          roleName: response.user.roleName,
          isVerified: response.user.isVerified,
          verifiedIcon: response.user.isVerified ? '/verified-symbol-icon.svg' : '',
          createdAt: response.user.createdAt,
        },
        products: response.products.map(mapProduct),
        productsTotal: response.productsTotal,
      }),
      providesTags: ['Product'],
    }),

    getVideos: builder.query<
      {
        videos: VideoTutorial[]
        total: number
        totalPages: number
        page: number
      },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params: Record<string, string | number> = { page, limit }
        if (search) params.search = search
        return { url: '/video-tutorial', params }
      },
      transformResponse: (response: VideosApiResponse) => ({
        videos: response.videos.map((v) => ({
          id: v._id,
          title: v.title,
          description: v.description,
          thumbnail: getYouTubeThumbnail(v.videoUrl) || v.thumbnail,
          duration: v.duration,
          videoUrl: v.videoUrl,
          instructor: v.instructor,
          createdAt: v.createdAt,
        })),
        total: response.total,
        totalPages: response.totalPages,
        page: response.page,
      }),
      providesTags: ['Video'],
    }),

    getCourses: builder.query<
      { courses: Course[]; total: number; totalPages: number; page: number },
      { page?: number; limit?: number; search?: string; filter?: string }
    >({
      query: ({ page = 1, limit = 10, search, filter }) => {
        const params: Record<string, string | number> = { page, limit }
        if (search) params.search = search
        if (filter) params.filter = filter
        return { url: '/course', params }
      },
      transformResponse: (response: CoursesApiResponse) => ({
        courses: response.courses.map(mapCourse),
        total: response.pagination.totalCourses,
        totalPages: response.pagination.totalPages,
        page: response.pagination.currentPage,
      }),
      providesTags: ['Course'],
    }),

    getCourseById: builder.query<Course | null, string>({
      query: (id) => ({ url: `/course/${id}` }),
      transformResponse: (response: CourseDetailApiResponse) =>
        response.course ? mapCourse(response.course) : null,
      providesTags: ['Course'],
    }),

    getGurbaniCollections: builder.query<GurbaniCollection[], void>({
      query: () => '/gurbani',
      transformResponse: (response: GurbaniApiResponse) =>
        (response.gurbani || []).map(mapGurbaniCollection),
      providesTags: ['Gurbani'],
    }),

    getRaags: builder.query<RaagsApiResponse, void>({
      query: () => '/raag/all',
      transformResponse: (response: RaagsApiResponse) => ({
        ...response,
        raags: response.raags.map((r) => ({
          ...r,
          audioUrl: r.audioUrl ? getGoogleDriveAudioUrl(r.audioUrl) : '',
          listOfBandish: r.listOfBandish.map((b) => ({
            ...b,
            audioUrl: b.audioUrl ? getGoogleDriveAudioUrl(b.audioUrl) : null,
          })),
        })),
      }),
      providesTags: ['Raag'],
    }),

    getMyEnrollments: builder.query<
      { enrollments: ReturnType<typeof mapEnrollment>[]; total: number; totalPages: number; page: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/enrollment',
        params: { page, limit },
      }),
      transformResponse: (response: EnrollmentsApiResponse) => ({
        enrollments: response.enrollments.map(mapEnrollment),
        total: response.total,
        totalPages: response.totalPages,
        page: response.page,
      }),
      providesTags: ['Enrollment'],
    }),

    getCourseVideoBookmarks: builder.query<{ bookmarks: BookmarkItem[] }, void>({
      query: () => '/course-video-bookmarks',
      providesTags: ['Bookmark'],
    }),
    addCourseVideoBookmark: builder.mutation<
      BookmarkItem,
      { title: string; videoUrl: string; description?: string }
    >({
      query: (body) => ({
        url: '/course-video-bookmarks',
        method: 'POST',
    body,
  }),
  }),
    removeCourseVideoBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course-video-bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmark'],
    }),

    getTransactionHistory: builder.query<
      { transactions: Transaction[]; total: number; page: number; totalPages: number; pageSize: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/user/wallet/transactions',
        params: { page, limit },
      }),
      transformResponse: (response: TransactionHistoryResponse) => ({
        transactions: response.transactions.map((t) => ({
          _id: t._id,
          type: t.type,
          amount: t.amount,
          reason: t.reason,
          title: t.title,
          description: t.description,
          referenceId: t.referenceId,
          referenceModel: t.referenceModel,
          balanceBefore: t.balanceBefore,
          balanceAfter: t.balanceAfter,
          createdAt: t.createdAt,
        })),
        total: response.total,
        page: response.page,
        totalPages: response.totalPages,
        pageSize: response.pageSize,
      }),
    }),

    submitSuggestion: builder.mutation<void, { title: string; description: string }>({
      query: (body) => ({
        url: '/suggestion',
        method: 'POST',
        body,
      }),
    }),

    enrollCourse: builder.mutation<void, { courseId: string }>({
      query: (body) => ({
        url: '/enrollment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Course', 'Enrollment'],
    }),

    getCollaborators: builder.query<import('@/types').Collaborator[], void>({
      query: () => '/collaborator/get-all',
      transformResponse: (response: CollaboratorsApiResponse) =>
        response.collaborators.map((c) => ({
          ...c,
          profile: c.profile ? resolveImageUrl(c.profile) : undefined,
          coverProfile: c.coverProfile ? resolveImageUrl(c.coverProfile) : undefined,
        })),
      providesTags: ['Collaborator'],
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/user/delete-account',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    getPreviousResults: builder.query<import('@/types').PreviousResultsApiResponse, void>({
      query: () => '/previous-result',
    }),

    getCollaboratorById: builder.query<import('@/types').Collaborator, string>({
      query: (id) => `/collaborator/get/${id}`,
      transformResponse: (response: { success: boolean; message: string; collaborator: import('@/types').Collaborator }) => ({
        ...response.collaborator,
        profile: response.collaborator.profile ? resolveImageUrl(response.collaborator.profile) : undefined,
        coverProfile: response.collaborator.coverProfile ? resolveImageUrl(response.collaborator.coverProfile) : undefined,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Collaborator', id }],
    }),

    uploadFile: builder.mutation<{ success: boolean; message: string; url: string }, FormData>({
      query: (body) => ({
        url: '/file-upload',
        method: 'POST',
        body,
      }),
    }),

    checkDevice: builder.mutation<import('@/types').CheckDeviceResponse, { deviceId: string }>({
      query: ({ deviceId }) => ({
        url: '/referral/check-device',
        method: 'POST',
        body: { deviceId },
      }),
    }),

    getMyReferralCode: builder.query<import('@/types').ReferralCodeResponse, void>({
      query: () => '/referral/my-code',
      providesTags: ['Referral'],
    }),

    getReferralHistory: builder.query<
      import('@/types').ReferralHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/referral/history',
        params: { page, limit },
      }),
      transformResponse: (response: import('@/types').ReferralHistoryResponse) => ({
        ...response,
        referrals: response.referrals.map((r: unknown) => {
          const ref = r as { status?: number }
          return { ...ref, status: ref.status === 1 ? 'pending' : ref.status === 2 ? 'successful' : 'failed' }
        }),
      }),
      providesTags: ['Referral'],
    }),

    getRaagAccess: builder.query<import('@/types').RaagAccessResponse, void>({
      query: () => '/referral/raag-access',
      providesTags: ['Referral'],
    }),

    getSingleRaagAccess: builder.query<import('@/types').SingleRaagAccessResponse, number>({
      query: (raagNumber) => `/referral/raag-access/${raagNumber}`,
      providesTags: (_result, _error, raagNumber) => [{ type: 'Referral', id: raagNumber }],
    }),

  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useSocialLoginMutation,
  useGetUserDetailQuery,
  useChangePasswordMutation,
  useSetPasswordMutation,
  useUpdateUserMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUserWithProductsQuery,
  useGetVideosQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetGurbaniCollectionsQuery,
  useGetRaagsQuery,
  useGetMyEnrollmentsQuery,
  useGetCourseVideoBookmarksQuery,
  useAddCourseVideoBookmarkMutation,
  useRemoveCourseVideoBookmarkMutation,
  useSubmitSuggestionMutation,
  useEnrollCourseMutation,
  useGetTransactionHistoryQuery,
  useGetCollaboratorsQuery,
  useDeleteAccountMutation,
  useUploadFileMutation,
  useGetPreviousResultsQuery,
  useGetCollaboratorByIdQuery,
  useCheckDeviceMutation,
  useGetMyReferralCodeQuery,
  useGetReferralHistoryQuery,
  useGetRaagAccessQuery,
  useGetSingleRaagAccessQuery,
} = api
