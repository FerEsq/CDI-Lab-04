import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from '../../utils/constants';

// Define types for our API responses
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface FileUploadResponse {
  url: string;
  filename: string;
}

// Define a service using a base URL and expected endpoints
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState: _ }) => {
      // Get token from cookies
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Auth endpoints (unprotected)
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store token in httpOnly cookie (server should set this)
          // We'll also store a non-httpOnly cookie for client-side access
          Cookies.set(TOKEN_COOKIE_NAME, data.token, {
            secure: true, // Only send cookie over HTTPS
            sameSite: 'strict', // Protect against CSRF
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Cookie expires in 1 hour
          });
        } catch {}
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set(TOKEN_COOKIE_NAME, data.token, {
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
          });
        } catch {}
      },
    }),
    
    // Protected file upload endpoint
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: 'files/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Remove the cookie regardless of the API call result
          Cookies.remove(TOKEN_COOKIE_NAME);
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useUploadFileMutation,
  useLogoutMutation,
} = apiSlice; 