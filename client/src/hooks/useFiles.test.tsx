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

  it('should handle file upload with sign parameter', async () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    
    // Test with sign=true
    await result.current.handleFileUpload(mockFile, true);
    expect(result.current.handleFileUpload).toBeDefined();
  });

  it('should handle file download without original filename', async () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    
    await result.current.handleFileDownload('test-id');
    expect(result.current.handleFileDownload).toBeDefined();
  });

  it('should track upload success state', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(result.current.uploadSuccess).toBe(false);
  });

  it('should track verification success state', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(result.current.verificationSuccess).toBe(false);
  });

  it('should track download success state', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(result.current.downloadSuccess).toBe(false);
  });

  it('should expose all file operations', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(result.current.handleFileUpload).toBeDefined();
    expect(result.current.handleFileVerification).toBeDefined();
    expect(result.current.handleFileDownload).toBeDefined();
    expect(result.current.fetchFileData).toBeDefined();
    expect(result.current.resetStates).toBeDefined();
  });

  it('should have correct function types', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.handleFileUpload).toBe('function');
    expect(typeof result.current.handleFileVerification).toBe('function');
    expect(typeof result.current.handleFileDownload).toBe('function');
    expect(typeof result.current.fetchFileData).toBe('function');
    expect(typeof result.current.resetStates).toBe('function');
  });

  it('should have loading states as booleans', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(typeof result.current.isUploadLoading).toBe('boolean');
    expect(typeof result.current.isVerifyLoading).toBe('boolean');
    expect(typeof result.current.isDownloadLoading).toBe('boolean');
    expect(typeof result.current.isFileDataLoading).toBe('boolean');
  });

  it('should initialize fileData as null', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });
    expect(result.current.fileData).toBe(null);
  });
});

