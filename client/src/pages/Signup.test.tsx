import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
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

  it('has email input', () => {
    const { container } = renderWithProviders(<Signup />);
    const emailInputs = container.querySelectorAll('input[type="email"]');
    expect(emailInputs.length).toBeGreaterThan(0);
  });

  it('has password input', () => {
    const { container } = renderWithProviders(<Signup />);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it('has submit button', () => {
    const { container } = renderWithProviders(<Signup />);
    const buttons = container.querySelectorAll('button[type="submit"]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('can type in input fields', () => {
    const { container } = renderWithProviders(<Signup />);
    const input = container.querySelector('input');
    
    if (input) {
      fireEvent.change(input, { target: { value: 'test' } });
      expect(input.value).toBeTruthy();
    }
  });

  it('renders signup page layout', () => {
    const { container } = renderWithProviders(<Signup />);
    expect(container.firstChild).toBeTruthy();
  });
});
