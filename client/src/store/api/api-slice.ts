import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setAppState } from '../slices/appState-slice';
import { AuthResponse, FileUploadResponse, FileVerificationResponse, LoginRequest, RegisterRequest } from './types';

// Interfaz para los datos de archivo
export interface FileItem {
  _id: string;
  filename: string;
  created_at: string;
  original_name: string;
  is_signed: boolean;
  mime_type: string;
  owner_id: string;
  signature: string | null;
  signed_at?: string;
  size: number;
}

// Define a service using a base URL and expected endpoints
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({ 
  baseUrl: baseUrl,
  credentials: 'include', // Include cookies in requests
  prepareHeaders: (headers) => {
    // No need to manually set authorization header since we're using HTTP-only cookies
    return headers;
  },
});

// Create a custom base query that handles 401 errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  // If the response is 401, try to refresh the token
  if ((result.error as FetchBaseQueryError)?.status === 401) {
    console.log('Token expired, attempting refresh...');
    
    // Try to refresh the token using the refresh endpoint
    const refreshResult = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (refreshResult.ok) {
      console.log('Token refreshed successfully!');
      // Retry the original request
      return baseQuery(args, api, extraOptions);
    } else {
      console.log('Refresh failed, logging out...');
      // Update app state to logged out
      api.dispatch(setAppState('NOT_LOGGED_IN'));
    }
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
        credentials: 'include', // Include cookies in response
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          // HTTP-only cookies are not accessible from JavaScript (this is correct for security)
          // The cookies are automatically sent with subsequent requests
          console.log('Login successful, HTTP-only cookies set by server:', result.data);
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
        credentials: 'include', // Include cookies in response
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Tokens are automatically set as HTTP-only cookies by the server
          console.log('Registration successful, tokens set as HTTP-only cookies');
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
    }),
    
    // Logout endpoint
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        credentials: 'include', // Include cookies
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Cookies are automatically cleared by the server
          console.log('Logout successful, cookies cleared');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
    
    // Check authentication status
    checkAuth: builder.query<{ authenticated: boolean }, void>({
      query: () => ({
        url: 'files/',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: () => ({ authenticated: true }),
      transformErrorResponse: () => ({ authenticated: false }),
    }),
    
    // Protected file upload endpoint
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData) => ({
        url: 'files/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    verifyFile: builder.mutation<FileVerificationResponse, FormData>({
      query: (formData) => ({
        url: 'files/verify',
        method: 'POST',
        body: formData,
      }),
    }),

    // Nuevos endpoints agregados
    downloadFile: builder.mutation<Blob, string>({
      query: (fileId) => ({
        url: `files/${fileId}/download`,
        method: 'GET',
        responseHandler: (response: Response) => response.blob(),
      }),
    }),

    getFileData: builder.query<FileItem, string>({
      query: (fileId) => `files/${fileId}/info`,
    }),

    getAllFiles: builder.query<FileItem[], void>({
      query: () => 'files/',
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,        // Nuevo export
  useCheckAuthQuery,        // Nuevo export
  useUploadFileMutation,
  useVerifyFileMutation,
  useDownloadFileMutation,  // Nuevo export
  useGetFileDataQuery,      // Nuevo export
  useLazyGetFileDataQuery,  // Nuevo export
  useGetAllFilesQuery,      // Nuevo export
} = apiSlice;