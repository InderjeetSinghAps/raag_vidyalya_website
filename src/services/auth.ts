import api from './api'

export const authService = {
  login: (email: string, password: string, deviceToken = 'NA', deviceType = 2) =>
    api.post('/user/user-login', { email, password, deviceToken, deviceType }),

  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/user/user-login', data),

  verifyOtp: (email: string, otp: string, type: 1 | 2 = 1) =>
    api.post('/user/verify-otp', { email, otp, type }),

  forgotPassword: (email: string) =>
    api.post('/user/forget-password', { email }),

  resetPassword: (email: string, password: string) =>
    api.post('/user/reset-password', { email, password }),

  logout: () => api.post('/user/user-logout'),

  socialLogin: (data: {
    email: string
    provider: string
    providerId: string
    firstName: string
    profileImage?: string
    deviceType?: number
    deviceToken?: string
  }) => api.post('/user/social-login', data),
}
