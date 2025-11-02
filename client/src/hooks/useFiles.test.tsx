import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import useFiles from './useFiles';
import appStateReducer from '../store/slices/appState-slice';
import { apiSlice } from '../store/api/api-slice';
import { mockFile, mockFileItem } from '../test/mockData';

const createMockStore = () =>
  configureStore({
    reducer: {
      appState: appStateReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

describe('useFiles hook', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });

    expect(result.current.uploadSuccess).toBe(false);
    expect(result.current.verificationSuccess).toBe(false);
    expect(result.current.downloadSuccess).toBe(false);
    expect(result.current.fileData).toBe(null);
    expect(result.current.isUploadLoading).toBe(false);
    expect(result.current.isVerifyLoading).toBe(false);
    expect(result.current.isDownloadLoading).toBe(false);
    expect(result.current.isFileDataLoading).toBe(false);
  });

  it('should have handleFileUpload function', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.handleFileUpload).toBe('function');
  });

  it('should have handleFileVerification function', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.handleFileVerification).toBe('function');
  });

  it('should have handleFileDownload function', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.handleFileDownload).toBe('function');
  });

  it('should have fetchFileData function', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.fetchFileData).toBe('function');
  });

  it('should have resetStates function', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.resetStates).toBe('function');
  });

  it('should reset all states when calling resetStates', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    
    // Call resetStates
    result.current.resetStates();

    expect(result.current.uploadSuccess).toBe(false);
    expect(result.current.verificationSuccess).toBe(false);
    expect(result.current.downloadSuccess).toBe(false);
    expect(result.current.fileData).toBe(null);
  });

  it('should handle file upload errors gracefully', async () => {
    const mockError = { error: 'Upload failed' };
    
    vi.spyOn(apiSlice.endpoints.uploadFile, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useFiles(), { wrapper });

    const uploadResult = await result.current.handleFileUpload(mockFile);

    expect(uploadResult).toBe(null);
    expect(result.current.uploadSuccess).toBe(false);
  });

  it('should handle file verification errors gracefully', async () => {
    const mockError = { error: 'Verification failed' };
    
    vi.spyOn(apiSlice.endpoints.verifyFile, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useFiles(), { wrapper });

    const verificationResult = await result.current.handleFileVerification(mockFile);

    expect(verificationResult).toBe(null);
    expect(result.current.verificationSuccess).toBe(false);
  });

  it('should return null when file data fetch fails', async () => {
    const mockError = { error: 'Fetch failed' };
    
    vi.spyOn(apiSlice.endpoints.getFileData, 'initiate').mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(mockError),
    } as any);

    const { result } = renderHook(() => useFiles(), { wrapper });

    const fileData = await result.current.fetchFileData('test-file-id');

    expect(fileData).toBe(null);
  });
});

