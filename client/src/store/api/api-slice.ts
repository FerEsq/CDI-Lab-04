import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from '../../utils/constants';
import { setAppState } from '../slices/appState-slice';

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

const baseQuery = fetchBaseQuery({ 
  baseUrl: baseUrl,
  prepareHeaders: (headers, { getState: _ }) => {
    // Get token from cookies
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query that handles 401 errors
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If the response is 401, handle unauthorized access
  if ((result.error as FetchBaseQueryError)?.status === 401) {
    // Remove the token
    Cookies.remove(TOKEN_COOKIE_NAME);
    // Update app state to logged out
    api.dispatch(setAppState('NOT_LOGGED_IN'));
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useUploadFileMutation,
} = apiSlice; 