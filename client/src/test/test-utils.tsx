import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from '../store/slices/appState-slice';
import { apiSlice } from '../store/api/api-slice';

// Create a custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        appState: appStateReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    }),
    withRouter = true,
    ...renderOptions
  }: {
    preloadedState?: any;
    store?: any;
    withRouter?: boolean;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    if (withRouter) {
      return (
        <Provider store={store}>
          <BrowserRouter>{children}</BrowserRouter>
        </Provider>
      );
    }
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

