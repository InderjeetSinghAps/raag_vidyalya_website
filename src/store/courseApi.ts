import { api, resolveImageUrl, mapCourse, mapEnrollment, _getYouTubeThumbnail } from './api-base';
import type {
  StoreProduct,
  Course,
  VideoTutorial,
} from '@/types';
import type {
  ProductsApiResponse,
  ProductDetailApiResponse,
  UserWithProductsApiResponse,
  VideosApiResponse,
  CoursesApiResponse,
  CourseDetailApiResponse,
  EnrollmentsApiResponse,
  BookmarkItem,
  BookmarksApiResponse,
} from '@/types/api';

import { mapProduct } from './api-base';

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      {
        products: StoreProduct[];
        total: number;
        totalPages: number;
        page: number;
      },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        };
        if (search) params.search = search;
        return { url: '/product', params };
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
      {
        user: {
          id: string;
          userName: string;
          email: string;
          profileImage: string;
          phoneNumber: string;
          countryCode: string;
          roleName: string;
          isVerified: boolean;
          verifiedIcon: string;
          createdAt: string;
        };
        products: StoreProduct[];
        productsTotal: number;
      },
      string
    >({
      query: (id) => ({ url: `/user/${id}/with-products` }),
      transformResponse: (response: UserWithProductsApiResponse) => ({
        user: {
          id: response.user._id,
          userName: response.user.userName,
          email: response.user.email,
          profileImage: resolveImageUrl(
            response.user.profileImage || '',
          ),
          phoneNumber: response.user.phoneNumber,
          countryCode: response.user.countryCode,
          roleName: response.user.roleName,
          isVerified: response.user.isVerified,
          verifiedIcon: response.user.isVerified
            ? '/verified-symbol-icon.svg'
            : '',
          createdAt: response.user.createdAt,
        },
        products: response.products.map(mapProduct),
        productsTotal: response.productsTotal,
      }),
      providesTags: ['Product'],
    }),

    getVideos: builder.query<
      {
        videos: VideoTutorial[];
        total: number;
        totalPages: number;
        page: number;
      },
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        };
        if (search) params.search = search;
        return { url: '/video-tutorial', params };
      },
      transformResponse: (response: VideosApiResponse) => ({
        videos: response.videos.map((v) => ({
          id: v._id,
          title: v.title,
          description: v.description,
          thumbnail: _getYouTubeThumbnail(v.videoUrl) || v.thumbnail,
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
      {
        courses: Course[];
        total: number;
        totalPages: number;
        page: number;
      },
      {
        page?: number;
        limit?: number;
        search?: string;
        filter?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search, filter }) => {
        const params: Record<string, string | number> = {
          page,
          limit,
        };
        if (search) params.search = search;
        if (filter) params.filter = filter;
        return { url: '/course', params };
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

    getMyEnrollments: builder.query<
      {
        enrollments: ReturnType<typeof mapEnrollment>[];
        total: number;
        totalPages: number;
        page: number;
      },
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

    getCourseVideoBookmarks: builder.query<
      { bookmarks: BookmarkItem[] },
      void
    >({
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
      invalidatesTags: ['Bookmark'],
    }),

    removeCourseVideoBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course-video-bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmark'],
    }),

    submitSuggestion: builder.mutation<
      void,
      { title: string; description: string }
    >({
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
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUserWithProductsQuery,
  useGetVideosQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetMyEnrollmentsQuery,
  useGetCourseVideoBookmarksQuery,
  useAddCourseVideoBookmarkMutation,
  useRemoveCourseVideoBookmarkMutation,
  useSubmitSuggestionMutation,
  useEnrollCourseMutation,
} = courseApi
