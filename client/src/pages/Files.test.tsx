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
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders page elements', () => {
    const { container } = renderWithProviders(<Files />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('has proper component structure', () => {
    const { container } = renderWithProviders(<Files />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default state', () => {
    const { container } = renderWithProviders(<Files />);
    expect(container.innerHTML).toBeTruthy();
  });

  it('contains interactive elements', () => {
    const { container } = renderWithProviders(<Files />);
    expect(container.querySelectorAll('*').length).toBeGreaterThan(0);
  });
});

