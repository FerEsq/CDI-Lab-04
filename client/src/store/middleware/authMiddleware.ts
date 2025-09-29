import { Middleware } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authMiddleware: Middleware = () => (next) => (action: any) => {
  // With HTTP-only cookies, we can't check token validity from the frontend
  // The authentication state is now managed by:
  // 1. The API slice's baseQueryWithReauth which handles 401 responses
  // 2. The server-side validation of HTTP-only cookies
  // 3. The app state slice which tracks login/logout actions
  
  // We only need to handle specific actions that should trigger logout
  if (action.type === 'api/executeQuery/rejected' || action.type === 'api/executeMutation/rejected') {
    const error = action.payload;
    if (error?.status === 401) {
      console.log('401 error detected, will be handled by baseQueryWithReauth');
      // The baseQueryWithReauth will handle the refresh attempt and logout if needed
    }
  }

  return next(action);
}; 