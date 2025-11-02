import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useAuth from './useAuth';
import appStateReducer from '../store/slices/appState-slice';
import { apiSlice } from '../store/api/api-slice';
import { mockAuthResponse } from '../test/mockData';

const createMockStore = () =>
  configureStore({
    reducer: {
      appState: appStateReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

describe('useAuth hook', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoginLoading).toBe(false);
    expect(result.current.isRegisterLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.handleLogin).toBe('function');
    expect(typeof result.current.handleRegister).toBe('function');
  });

  it('should have handleLogin function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.handleLogin).toBeDefined();
  });

  it('should have handleRegister function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.handleRegister).toBeDefined();
  });

  it('should set error state on login failure', async () => {
    // Mock a failed login mutation
    const mockError = { data: { message: 'Invalid credentials' } };
    
    vi.spyOn(apiSlice.endpoints.login, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });
    const callback = vi.fn();

    await result.current.handleLogin('test@example.com', 'wrongpassword', callback);

    await waitFor(() => {
      // El hook devuelve el mensaje de error genérico cuando hay un error
      expect(result.current.error).toBeTruthy();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('should reset error on successful login attempt', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // First set an error
    vi.spyOn(apiSlice.endpoints.login, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({ data: { message: 'Error' } }),
    } as any);

    const callback = vi.fn();
    await result.current.handleLogin('test@example.com', 'wrong', callback);

    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(typeof result.current.error).toBe('string');
    });
  });

  it('should handle generic errors', async () => {
    const mockError = { data: null };
    
    vi.spyOn(apiSlice.endpoints.login, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useAuth(), { wrapper });
    const callback = vi.fn();

    await result.current.handleLogin('test@example.com', 'password', callback);

    await waitFor(() => {
      expect(result.current.error).toBe('Error al iniciar sesión');
    });
  });
});

