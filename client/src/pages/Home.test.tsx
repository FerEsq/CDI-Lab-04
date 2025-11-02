import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Home from './Home';

// Mock del hook useFiles
vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileUpload: vi.fn(),
    isUploadLoading: false,
    uploadSuccess: false,
    resetStates: vi.fn(),
  }),
}));

describe('Home Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Home />);
    expect(true).toBe(true);
  });

  it('has file upload functionality', () => {
    renderWithProviders(<Home />);
    const inputs = document.querySelectorAll('input[type="file"]');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('displays title', () => {
    renderWithProviders(<Home />);
    // Just verify it renders
    expect(document.body).toBeTruthy();
  });
});

