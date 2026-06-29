import { api, resolveImageUrl, mapGurbaniCollection, _getGoogleDriveAudioUrl } from './api-base';
import type {
  GurbaniCollection,
  RaagsApiResponse,
  Transaction,
  Collaborator,
  PreviousResultsApiResponse,
  CheckDeviceResponse,
  ReferralCodeResponse,
  ReferralHistoryResponse,
  RaagAccessResponse,
  SingleRaagAccessResponse,
} from '@/types';
import type {
  GurbaniApiResponse,
  CollaboratorsApiResponse,
  TransactionHistoryResponse,
} from '@/types/api';

export const contentApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
          audioUrl: r.audioUrl
            ? _getGoogleDriveAudioUrl(r.audioUrl)
            : '',
          listOfBandish: (r.listOfBandish ?? []).map((b) => ({
            ...b,
            audioUrl: b.audioUrl
              ? _getGoogleDriveAudioUrl(b.audioUrl)
              : null,
          })),
        })),
      }),
      providesTags: ['Raag'],
    }),

    getTransactionHistory: builder.query<
      {
        transactions: Transaction[];
        total: number;
        page: number;
        totalPages: number;
        pageSize: number;
      },
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

    getCollaborators: builder.query<
      Collaborator[],
      void
    >({
      query: () => '/collaborator/get-all',
      transformResponse: (response: CollaboratorsApiResponse) =>
        response.collaborators.map((c) => ({
          ...c,
          profile: c.profile ? resolveImageUrl(c.profile) : undefined,
          coverProfile: c.coverProfile
            ? resolveImageUrl(c.coverProfile)
            : undefined,
        })),
      providesTags: ['Collaborator'],
    }),

    getPreviousResults: builder.query<
      PreviousResultsApiResponse,
      void
    >({
      query: () => '/previous-result',
    }),

    getCollaboratorById: builder.query<
      Collaborator,
      string
    >({
      query: (id) => `/collaborator/get/${id}`,
      transformResponse: (response: {
        success: boolean;
        message: string;
        collaborator: Collaborator;
      }) => ({
        ...response.collaborator,
        profile: response.collaborator.profile
          ? resolveImageUrl(response.collaborator.profile)
          : undefined,
        coverProfile: response.collaborator.coverProfile
          ? resolveImageUrl(response.collaborator.coverProfile)
          : undefined,
      }),
      providesTags: (_result: unknown, _error: unknown, id: string) => [
        { type: 'Collaborator' as const, id },
      ],
    }),

    uploadFile: builder.mutation<
      { success: boolean; message: string; url: string },
      FormData
    >({
      query: (body) => ({
        url: '/file-upload',
        method: 'POST',
        body,
      }),
    }),

    checkDevice: builder.mutation<
      CheckDeviceResponse,
      { deviceId: string }
    >({
      query: ({ deviceId }) => ({
        url: '/referral/check-device',
        method: 'POST',
        body: { deviceId },
      }),
    }),

    getMyReferralCode: builder.query<
      ReferralCodeResponse,
      void
    >({
      query: () => '/referral/my-code',
      providesTags: ['Referral'],
    }),

    getReferralHistory: builder.query<
      ReferralHistoryResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/referral/history',
        params: { page, limit },
      }),
      transformResponse: (
        response: ReferralHistoryResponse,
      ) => ({
        ...response,
        referrals: response.referrals.map((r: unknown) => {
          const ref = r as { status?: number };
          return {
            ...ref,
            status:
              ref.status === 1
                ? 'pending'
                : ref.status === 2
                  ? 'successful'
                  : 'failed',
          };
        }),
      }),
      providesTags: ['Referral'],
    }),

    getRaagAccess: builder.query<
      RaagAccessResponse,
      void
    >({
      query: () => '/referral/raag-access',
      providesTags: ['Referral'],
    }),

    getSingleRaagAccess: builder.query<
      SingleRaagAccessResponse,
      number
    >({
      query: (raagNumber) => `/referral/raag-access/${raagNumber}`,
      providesTags: (_result: unknown, _error: unknown, raagNumber: number) => [
        { type: 'Referral' as const, id: raagNumber },
      ],
    }),
  }),
})

export const {
  useGetGurbaniCollectionsQuery,
  useGetRaagsQuery,
  useGetTransactionHistoryQuery,
  useGetCollaboratorsQuery,
  useGetPreviousResultsQuery,
  useGetCollaboratorByIdQuery,
  useUploadFileMutation,
  useCheckDeviceMutation,
  useGetMyReferralCodeQuery,
  useGetReferralHistoryQuery,
  useGetRaagAccessQuery,
  useGetSingleRaagAccessQuery,
} = contentApi
