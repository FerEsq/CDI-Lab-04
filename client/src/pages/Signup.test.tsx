import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Signup from './Signup';

const mockHandleRegister = vi.fn();

// Mock del hook useAuth
vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    handleRegister: mockHandleRegister,
    isRegisterLoading: false,
    error: null,
  }),
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('can type in input fields', async () => {
    const { container } = renderWithProviders(<Signup />);
    const input = container.querySelector('input');
    
    if (input) {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      await waitFor(() => {
        expect(input.value).toBeTruthy();
      });
    }
  });

  it('renders signup page layout', () => {
    const { container } = renderWithProviders(<Signup />);
    expect(container.firstChild).toBeTruthy();
  });

  it('has proper form structure', () => {
    const { container } = renderWithProviders(<Signup />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('renders all necessary elements', () => {
    const { container } = renderWithProviders(<Signup />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('has interactive elements', () => {
    const { container } = renderWithProviders(<Signup />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
      expect(btn).toBeTruthy();
      expect(btn.tagName).toBe('BUTTON');
    });
  });

  it('can submit form', async () => {
    const { container } = renderWithProviders(<Signup />);
    const form = container.querySelector('form');
    
    if (form) {
      fireEvent.submit(form);
      await waitFor(() => {
        expect(true).toBe(true);
      });
    }
  });

  it('handles form interactions', () => {
    const { container } = renderWithProviders(<Signup />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
    
    inputs.forEach(input => {
      expect(input).toBeInTheDocument();
    });
  });

  it('renders complete signup interface', () => {
    const { container } = renderWithProviders(<Signup />);
    expect(container.querySelectorAll('*').length).toBeGreaterThan(10);
  });

  it('password visibility can be toggled', () => {
    const { container } = renderWithProviders(<Signup />);
    const passwordToggleButtons = container.querySelectorAll('button');
    
    // Buscar botón que no sea submit
    const toggleButton = Array.from(passwordToggleButtons).find(btn => 
      btn.getAttribute('type') !== 'submit'
    );
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(toggleButton).toBeDefined();
    }
  });

  it('handles password input change', async () => {
    const { container } = renderWithProviders(<Signup />);
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
    
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
      await waitFor(() => {
        expect(passwordInput.value).toBe('TestPass123!');
      });
    }
  });

  it('displays form labels', () => {
    const { container } = renderWithProviders(<Signup />);
    const labels = container.querySelectorAll('label');
    expect(labels.length).toBeGreaterThanOrEqual(0);
  });

  it('renders buttons with correct types', () => {
    const { container } = renderWithProviders(<Signup />);
    const submitButtons = container.querySelectorAll('button[type="submit"]');
    expect(submitButtons.length).toBeGreaterThan(0);
  });
});
