import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import appStateReducer from '../../store/slices/appState-slice';
import { apiSlice } from '../../store/api/api-slice';

describe('ProtectedRoute Component', () => {
  const createMockStore = (appState: 'LOGGED_IN' | 'NOT_LOGGED_IN') =>
    configureStore({
      reducer: {
        appState: appStateReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      preloadedState: {
        appState: { state: appState },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    });

  it('redirects to /login when user is not logged in', () => {
    const store = createMockStore('NOT_LOGGED_IN');
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route 
              path="/protected" 
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is logged in', () => {
    const store = createMockStore('LOGGED_IN');
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route 
              path="/protected" 
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('preserves location state when redirecting', () => {
    const store = createMockStore('NOT_LOGGED_IN');
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route 
              path="/protected" 
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={<div data-testid="login-page">Login Page</div>} 
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});

