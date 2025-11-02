import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/test-utils';
import Verify from './Verify';

// Mock del hook useFiles
vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileVerification: vi.fn(),
    isVerifyLoading: false,
    verificationSuccess: false,
    verifyError: null,
    resetStates: vi.fn(),
  }),
}));

describe('Verify Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Verify />);
    expect(true).toBe(true);
  });

  it('has file input', () => {
    const { container } = renderWithProviders(<Verify />);
    const fileInputs = container.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBeGreaterThan(0);
  });

  it('renders verification interface', () => {
    const { container } = renderWithProviders(<Verify />);
    expect(container).toBeTruthy();
  });
});

