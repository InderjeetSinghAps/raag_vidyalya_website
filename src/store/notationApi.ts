import { api } from './api-base';
import type {
  Taal,
  NotationItem,
  CreateNotationPayload,
  NotationsListResponse,
} from '@/types/notation';

export const notationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTaals: builder.query<Taal[], void>({
      query: () => '/notation/taals',
      transformResponse: (response: { success: boolean; data: Taal[] }) =>
        response.data || [],
    }),

    getMyNotations: builder.query<
      NotationsListResponse,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (params) => ({
        url: '/notation/my-notations',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          search: params?.search || '',
        },
      }),
      transformResponse: (response: any) => ({
        success: response.success ?? true,
        notations: response.notations || response.data || [],
        total: response.total ?? (response.notations?.length || response.data?.length || 0),
        page: response.page ?? 1,
        totalPages: response.totalPages ?? 1,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.notations.map(({ _id }) => ({
                type: 'Notation' as const,
                id: _id,
              })),
              { type: 'Notation', id: 'LIST' },
            ]
          : [{ type: 'Notation', id: 'LIST' }],
    }),

    getNotationById: builder.query<NotationItem, string>({
      query: (id) => `/notation/${id}`,
      transformResponse: (response: { success: boolean; data: NotationItem }) =>
        response.data,
      providesTags: (_result, _error, id) => [{ type: 'Notation', id }],
    }),

    getNotationByShareId: builder.query<NotationItem, string>({
      query: (shareId) => `/notation/share/${shareId}`,
      transformResponse: (response: { success: boolean; data: NotationItem }) =>
        response.data,
    }),

    createNotation: builder.mutation<NotationItem, CreateNotationPayload>({
      query: (body) => ({
        url: '/notation',
        method: 'POST',
        body,
      }),
      transformResponse: (response: {
        success: boolean;
        data: NotationItem;
        message?: string;
      }) => response.data,
      invalidatesTags: [{ type: 'Notation', id: 'LIST' }],
    }),

    updateNotation: builder.mutation<
      NotationItem,
      { id: string; data: Partial<CreateNotationPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/notation/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: {
        success: boolean;
        data: NotationItem;
        message?: string;
      }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notation', id },
        { type: 'Notation', id: 'LIST' },
      ],
    }),

    deleteNotation: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/notation/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notation', id },
        { type: 'Notation', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTaalsQuery,
  useGetMyNotationsQuery,
  useGetNotationByIdQuery,
  useGetNotationByShareIdQuery,
  useCreateNotationMutation,
  useUpdateNotationMutation,
  useDeleteNotationMutation,
} = notationApi;
