import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test/test-utils';
import Signup from './Signup';

// Mock del hook useAuth
vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    handleRegister: vi.fn(),
    isRegisterLoading: false,
    error: null,
  }),
}));

describe('Signup Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Signup />);
    expect(true).toBe(true);
  });

  it('has form elements', () => {
    const { container } = renderWithProviders(<Signup />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('has input fields', () => {
    const { container } = renderWithProviders(<Signup />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

