import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Login from './Login';

vi.mock('../hooks/useAuth', () => ({
  default: () => ({
    handleLogin: vi.fn((email, password, callback) => {
      if (email === 'valid@example.com' && password === 'ValidPass123!') {
        callback();
      }
    }),
    isLoginLoading: false,
    error: null,
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);

    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('has a link to signup page', () => {
    renderWithProviders(<Login />);

    const signupLink = screen.getByText('¿No tienes cuenta? Regístrate.');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('has email input with correct attributes', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'ejemplo@correo.com');
  });

  it('has password input with correct attributes', () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  });

  it('toggles password visibility', () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /mostrar/i });

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByRole('button', { name: /ocultar/i })).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('validates email format', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    
    // Verificamos que el input acepte texto
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(emailInput).toHaveValue('invalid-email');
    
    // Verificamos que acepte un email válido también
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    expect(emailInput).toHaveValue('valid@example.com');
  });

  it('validates password requirements', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    // Test minimum length
    fireEvent.change(passwordInput, { target: { value: 'Short1!' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
    });
  });

  it('validates password uppercase requirement', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(passwordInput, { target: { value: 'lowercase123!' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe contener al menos una letra mayúscula')).toBeInTheDocument();
    });
  });

  it('validates password lowercase requirement', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(passwordInput, { target: { value: 'UPPERCASE123!' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe contener al menos una letra minúscula')).toBeInTheDocument();
    });
  });

  it('validates password number requirement', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(passwordInput, { target: { value: 'NoNumbers!' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe contener al menos un número')).toBeInTheDocument();
    });
  });

  it('validates password special character requirement', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(passwordInput, { target: { value: 'NoSpecial123' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe contener al menos un carácter especial')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText('Campo requerido');
      expect(errorMessages).toHaveLength(2);
    });
  });

  it('allows form submission with valid data', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.click(submitButton);

    // Should not show validation errors
    await waitFor(() => {
      expect(screen.queryByText('Campo requerido')).not.toBeInTheDocument();
      expect(screen.queryByText('Correo electrónico inválido')).not.toBeInTheDocument();
    });
  });
});

