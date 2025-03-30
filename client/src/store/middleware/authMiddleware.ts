import { Middleware } from '@reduxjs/toolkit';
import { setAppState } from '../slices/appState-slice';
import { TOKEN_COOKIE_NAME } from '../../utils/constants';
import Cookies from 'js-cookie';

export const authMiddleware: Middleware = () => (next) => (action) => {
  // Check token validity on every action
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  
  // If there's no token and we're not on the login page, set state to NOT_LOGGED_IN
  if (!token && window.location.pathname !== '/login') {
    next(setAppState('NOT_LOGGED_IN'));
    return next(action);
  }

  // If there is a token but it's expired, remove it and set state to NOT_LOGGED_IN
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      
      if (Date.now() >= expirationTime) {
        Cookies.remove(TOKEN_COOKIE_NAME);
        next(setAppState('NOT_LOGGED_IN'));
      }
    } catch (error) {
      // If token is invalid, remove it and set state to NOT_LOGGED_IN
      Cookies.remove(TOKEN_COOKIE_NAME);
      next(setAppState('NOT_LOGGED_IN'));
    }
  }

  return next(action);
}; 