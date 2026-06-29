import { api } from './api-base';

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    purchaseSubscription: builder.mutation<
      { id: string; message: string },
      { planId: string; paymentReference: string }
    >({
      query: (body) => ({
        url: '/subscription/purchase',
        method: 'POST',
        body,
      }),
    }),

    confirmPayment: builder.mutation<
      { success: boolean; message: string },
      { id: string; paymentReference: string }
    >({
      query: ({ id, paymentReference }) => ({
        url: `/subscription/${id}/confirm-payment`,
        method: 'POST',
        body: { paymentReference },
      }),
    }),

    getActiveSubscription: builder.query<
      { active: boolean; planId?: string; expiresAt?: string },
      void
    >({
      query: () => '/subscription/active',
      providesTags: ['Subscription'],
    }),

    addWalletMoney: builder.mutation<
      { success: boolean; balance: number },
      { amount: number }
    >({
      query: (body) => ({
        url: '/user/wallet/add-money',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  usePurchaseSubscriptionMutation,
  useConfirmPaymentMutation,
  useGetActiveSubscriptionQuery,
  useAddWalletMoneyMutation,
} = subscriptionApi;
