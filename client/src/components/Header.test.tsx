import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Header from './Header';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';

vi.mock('js-cookie');

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Subir archivo')).toBeInTheDocument();
    expect(screen.getByText('Ver archivos')).toBeInTheDocument();
    expect(screen.getByText('Verificar Firma')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('navigation links have correct href attributes', () => {
    renderWithProviders(<Header />);
    
    const subirArchivoLink = screen.getByText('Subir archivo').closest('a');
    const verArchivosLink = screen.getByText('Ver archivos').closest('a');
    const verificarFirmaLink = screen.getByText('Verificar Firma').closest('a');
    
    expect(subirArchivoLink).toHaveAttribute('href', '/');
    expect(verArchivosLink).toHaveAttribute('href', '/files');
    expect(verificarFirmaLink).toHaveAttribute('href', '/verify');
  });

  it('calls logout handlers when logout button is clicked', () => {
    const { store } = renderWithProviders(<Header />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    // Check that cookies are removed
    expect(Cookies.remove).toHaveBeenCalledWith(TOKEN_COOKIE_NAME);
    expect(Cookies.remove).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE_NAME);
    
    // Check that app state is updated
    const state = store.getState();
    expect(state.appState.state).toBe('NOT_LOGGED_IN');
  });

  it('applies correct styles to header', () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector('header');
    
    expect(header).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '1000',
    });
  });

  it('logout button has correct styles', () => {
    renderWithProviders(<Header />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    expect(logoutButton).toHaveStyle({
      cursor: 'pointer',
    });
  });

  it('renders all navigation items', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Subir archivo')).toBeInTheDocument();
    expect(screen.getByText('Ver archivos')).toBeInTheDocument();
    expect(screen.getByText('Verificar Firma')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('navigation links are clickable', () => {
    renderWithProviders(<Header />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('header has fixed position', () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector('header');
    
    expect(header).toHaveStyle({
      position: 'fixed',
      zIndex: '1000',
    });
  });

  it('logout button can be clicked', () => {
    const { store } = renderWithProviders(<Header />);
    const logoutButton = screen.getByText('Cerrar Sesión');
    
    // Before click
    expect(store.getState().appState.state).toBe('NOT_LOGGED_IN');
    
    fireEvent.click(logoutButton);
    
    // After click
    expect(store.getState().appState.state).toBe('NOT_LOGGED_IN');
  });

  it('navigation links have correct text', () => {
    renderWithProviders(<Header />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
  });

  it('header renders consistently', () => {
    const { container, rerender } = renderWithProviders(<Header />);
    const initialHTML = container.innerHTML;
    
    rerender(<Header />);
    
    expect(container.innerHTML).toBe(initialHTML);
  });
});


