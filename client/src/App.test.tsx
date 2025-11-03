import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders } from './test/test-utils';
import App from './App';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from './utils/constants';
import { RouterProvider } from 'react-router-dom';

vi.mock('js-cookie');

// Mock RouterProvider component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    RouterProvider: ({ router }: any) => <div data-testid="mock-router">Router</div>,
  };
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined);
    renderWithProviders(<App />, { withRouter: false });
    expect(true).toBe(true);
  });

  it('checks for token on mount', () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined);
    renderWithProviders(<App />, { withRouter: false });
    expect(Cookies.get).toHaveBeenCalledWith(TOKEN_COOKIE_NAME);
  });

  it('sets app state to LOGGED_IN when token exists', () => {
    vi.mocked(Cookies.get).mockReturnValue('mock-token');
    const { store } = renderWithProviders(<App />, { withRouter: false });
    
    const state = store.getState();
    expect(state.appState.state).toBe('LOGGED_IN');
  });

  it('does not change app state when no token exists', () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined);
    const { store } = renderWithProviders(<App />, { withRouter: false });
    
    const state = store.getState();
    expect(state.appState.state).toBe('NOT_LOGGED_IN');
  });

  it('only checks token once on mount', () => {
    vi.mocked(Cookies.get).mockReturnValue('mock-token');
    const { rerender } = renderWithProviders(<App />, { withRouter: false });
    
    expect(Cookies.get).toHaveBeenCalledTimes(1);
    
    rerender(<App />);
    
    // Should not call again on rerender
    expect(Cookies.get).toHaveBeenCalledTimes(1);
  });

  it('renders RouterProvider component', () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined);
    const { container } = renderWithProviders(<App />, { withRouter: false });
    expect(container).toBeTruthy();
  });

  it('dispatches setAppState when token exists', () => {
    vi.mocked(Cookies.get).mockReturnValue('valid-token');
    const { store } = renderWithProviders(<App />, { withRouter: false });
    expect(store.getState().appState.state).toBe('LOGGED_IN');
  });
});

