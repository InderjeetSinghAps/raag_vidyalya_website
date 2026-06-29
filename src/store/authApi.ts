import { api, extractAuthResponse } from './api-base'
import type { User } from '@/types'

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; token: string; refreshToken: string },
      {
        email: string;
        password: string;
        rememberMe?: boolean;
        deviceToken?: string;
        deviceType?: number;
      }
    >({
      query: ({
        email,
        password,
        deviceToken = '',
        deviceType = 2,
      }) => ({
        url: '/user/user-login',
        method: 'POST',
        body: { email, password, deviceToken, deviceType },
      }),
      transformResponse: (response) => {
        const result = extractAuthResponse(
          response as Record<string, unknown>,
        );
        if (!result)
          throw new Error('Login response missing token or user');
        return result;
      },
      async onQueryStarted(
        { rememberMe },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled;
          const { setUser } = await import('@/store/authSlice');
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken,
              rememberMe: rememberMe ?? true,
            }),
          );
        } catch {
        }
      },
    }),

    signup: builder.mutation<
      { success: boolean; message: string; email: string },
      {
        email: string;
        password: string;
        userName: string;
        deviceType: number;
        deviceToken: string;
        deviceId: string;
        referralCode?: string;
        phoneNumber?: string;
        countryCode?: string;
        language?: string;
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
        user: User;
        token: string;
        refreshToken: string;
        referralCode?: string;
        raagUnlockedForReferrer?: {
          raagUnlocked: boolean;
          raagNumber: number;
          expiresAt: string;
        };
      },
      { email: string; otp: string; type?: 1 | 2 }
    >({
      query: ({ email, otp, type = 1 }) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body: { email, otp, type },
      }),
      transformResponse: (response) => {
        const raw = response as Record<string, unknown>;
        const result = extractAuthResponse(raw);
        if (result) {
          return {
            ...result,
            referralCode: raw.referralCode as string | undefined,
            raagUnlockedForReferrer: raw.raagUnlockedForReferrer as
              | {
                  raagUnlocked: boolean;
                  raagNumber: number;
                  expiresAt: string;
                }
              | undefined,
          };
        }
        const data = raw.data as Record<string, unknown> | undefined;
        if (data?._id) {
          return {
            user: { ...data, id: data._id } as User,
            token: '',
            refreshToken: '',
          };
        }
        throw new Error('Verify OTP response missing token or user');
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { setUser } = await import('@/store/authSlice');
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken,
              rememberMe: true,
            }),
          );
        } catch {
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

    resetPassword: builder.mutation<
      void,
      { email: string; password: string }
    >({
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
          await queryFulfilled;
        } catch {
        } finally {
          const { logout } = await import('@/store/authSlice');
          dispatch(logout());
        }
      },
    }),

    socialLogin: builder.mutation<
      { user: User; token: string; refreshToken: string },
      {
        email: string;
        provider: string;
        providerId: string;
        firstName: string;
        profileImage?: string;
        deviceType?: number;
        deviceToken?: string;
      }
    >({
      query: (body) => ({
        url: '/user/social-login',
        method: 'POST',
        body: {
          ...body,
          deviceType: body.deviceType ?? 2,
          deviceToken: body.deviceToken ?? '',
        },
      }),
      transformResponse: (response) => {
        const result = extractAuthResponse(
          response as Record<string, unknown>,
        );
        if (!result)
          throw new Error(
            'Social login response missing token or user',
          );
        return result;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { setUser } = await import('@/store/authSlice');
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken,
              rememberMe: true,
            }),
          );
        } catch {
        }
      },
    }),

    getUserDetail: builder.query<User, void>({
      query: () => '/user/user-detail',
      transformResponse: (
        response: import('@/types/api').UserDetailApiResponse,
      ) => response.user,
      providesTags: ['User'],
    }),

    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
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
        userName?: string;
        gender?: string;
        age?: number;
        phoneNumber?: string;
        countryCode?: string;
        profileImage?: string;
      }
    >({
      query: (body) => ({
        url: '/user/user-update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(
        _,
        { dispatch, getState, queryFulfilled },
      ) {
        try {
          await queryFulfilled;
          const state = getState() as unknown as {
            auth: {
              user: User | null;
              token: string | null;
              refreshToken: string | null;
            };
          };
          const { token, refreshToken } = state.auth;
          const result = await dispatch(
            (api as any).endpoints.getUserDetail.initiate(undefined, {
              forceRefetch: true,
            }),
          );
          if (result.data && token) {
            const { setUser } = await import('@/store/authSlice');
            dispatch(
              setUser({
                user: result.data,
                token,
                refreshToken: refreshToken || '',
              }),
            );
          }
        } catch {}
      },
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/user/delete-account',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
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
  useDeleteAccountMutation,
} = authApi
