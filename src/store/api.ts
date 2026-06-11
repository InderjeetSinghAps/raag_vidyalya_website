import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/constants'
import { getYouTubeThumbnail, getGoogleDriveDirectUrl } from '@/lib/video'
import { STORAGE_KEY, setUser, logout } from '@/store/authSlice'
import type { User, StoreProduct, VideoTutorial, Course, CourseVideo } from '@/types'

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
  user: { _id: string; userName: string; profileImage?: string }
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

function resolveImageUrl(path: string): string {
  const driveUrl = getGoogleDriveDirectUrl(path)
  if (driveUrl !== path) return driveUrl
  if (path.startsWith('/')) {
    return `${new URL(API_BASE_URL).origin}${path}`
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
  }
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
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
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
      window.location.href = '/login'
    }
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Product', 'Video', 'Course'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; token: string },
      { email: string; password: string; rememberMe?: boolean; deviceToken?: string; deviceType?: number }
    >({
      query: ({ email, password, deviceToken = 'NA', deviceType = 2 }) => ({
        url: '/user/user-login',
        method: 'POST',
        body: { email, password, deviceToken, deviceType },
      }),
      async onQueryStarted({ rememberMe }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { access_token, ...user } = data.user as { access_token: string } & User
          dispatch(setUser({ user, token: access_token, rememberMe: rememberMe ?? true }))
        } catch {
          /* error handled by caller */
        }
      },
    }),

    signup: builder.mutation<{ user: User; token: string }, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: '/user/user-signup',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { access_token, ...user } = data.user as { access_token: string } & User
          dispatch(setUser({ user, token: access_token, rememberMe: true }))
        } catch {
          /* error handled by caller */
        }
      },
    }),

    verifyOtp: builder.mutation<
      { user: User; token: string },
      { email: string; otp: string; type?: 1 | 2 }
    >({
      query: ({ email, otp, type = 1 }) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body: { email, otp, type },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { access_token, ...user } = data.user as { access_token: string } & User
          dispatch(setUser({ user, token: access_token, rememberMe: true }))
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
      { user: User; token: string },
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
        body: { ...body, deviceType: body.deviceType ?? 2, deviceToken: body.deviceToken ?? 'NA' },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { access_token, ...user } = data.user as { access_token: string } & User
          dispatch(setUser({ user, token: access_token, rememberMe: true }))
        } catch {
          /* error handled by caller */
        }
      },
    }),

    getUserDetail: builder.query<User, void>({
      query: () => '/user/user-detail',
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
    }),

    getProducts: builder.query<
      { products: StoreProduct[]; total: number; totalPages: number; page: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({ url: '/product', params: { page, limit } }),
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

    getVideos: builder.query<
      {
        videos: VideoTutorial[]
        total: number
        totalPages: number
        page: number
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({ url: '/video-tutorial', params: { page, limit } }),
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
      { page?: number; limit?: number; search?: string; type?: string; level?: string }
    >({
      query: ({ page = 1, limit = 10, search, type, level }) => {
        const params: Record<string, string | number> = { page, limit }
        if (search) params.search = search
        if (type && type !== 'all') params[type] = ''
        if (level && level !== 'all') params[level] = ''
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
  useGetVideosQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
} = api
