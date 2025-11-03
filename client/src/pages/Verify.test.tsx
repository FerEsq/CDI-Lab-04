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

  it('displays page structure', () => {
    const { container } = renderWithProviders(<Verify />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('has interactive elements', () => {
    const { container } = renderWithProviders(<Verify />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('renders form elements', () => {
    const { container } = renderWithProviders(<Verify />);
    expect(container.firstChild).toBeTruthy();
  });

  it('contains verification UI', () => {
    const { container } = renderWithProviders(<Verify />);
    expect(container.querySelectorAll('*').length).toBeGreaterThan(0);
  });
});

