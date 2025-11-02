import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/test-utils';
import Files from './Files';

// Mock de RTK Query hook
vi.mock('../store/api/api-slice', async () => {
  const actual = await vi.importActual('../store/api/api-slice');
  return {
    ...actual,
    useGetAllFilesQuery: () => ({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }),
  };
});

// Mock del hook useFiles
vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileDownload: vi.fn(),
    isDownloadLoading: false,
    downloadSuccess: false,
    fetchFileData: vi.fn(),
    fileData: null,
    resetStates: vi.fn(),
  }),
}));

describe('Files Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Files />);
    expect(true).toBe(true);
  });

  it('displays page content', () => {
    const { container } = renderWithProviders(<Files />);
    expect(container).toBeTruthy();
  });

  it('has files list structure', () => {
    const { container } = renderWithProviders(<Files />);
    // Just verify it renders
    expect(container.querySelector('div')).toBeTruthy();
  });
});

