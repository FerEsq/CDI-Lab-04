import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, TOKEN_EXPIRATION_TIME_THRESHOLD } from '../../utils/constants';
import { setAppState } from '../slices/appState-slice';

// Define types for our API responses
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  access_token_expiration_time: number;
  refresh_token_expiration_time: number;
  user?: {
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
  // get the time left of the token
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const timeLeft = expirationTime - Date.now();

    console.log("Time left: ", timeLeft, "Threshold: ", TOKEN_EXPIRATION_TIME_THRESHOLD);
    console.log("refresh token: ", Cookies.get(REFRESH_TOKEN_COOKIE_NAME));
    if (timeLeft < TOKEN_EXPIRATION_TIME_THRESHOLD) {
      // refresh the token
      console.log("Refreshing token");
      const refreshResult = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: Cookies.get(REFRESH_TOKEN_COOKIE_NAME) }),
      });
      if (refreshResult.ok) {
        const data = await refreshResult.json();
        console.log("Refreshed token: ", data);
        Cookies.set(TOKEN_COOKIE_NAME, data.access_token, {
          secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + Number(data.access_token_expiration_time)),
        });
      } else {
        console.log("Failed to refresh token");
        Cookies.remove(TOKEN_COOKIE_NAME);
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        api.dispatch(setAppState('NOT_LOGGED_IN'));
      }
    }
  }

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
          // Store tokens in cookies
          Cookies.set(TOKEN_COOKIE_NAME, data.access_token, {
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + Number(data.access_token_expiration_time)),
          });
          Cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token, {
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + Number(data.refresh_token_expiration_time)),
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
          Cookies.set(TOKEN_COOKIE_NAME, data.access_token, {
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + Number(data.access_token_expiration_time)),
          });
          Cookies.set(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token, {
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + Number(data.refresh_token_expiration_time)),
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