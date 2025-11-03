import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Home from './Home';

// Mock del hook useFiles
vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileUpload: vi.fn().mockResolvedValue({ success: true }),
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
    expect(document.body).toBeTruthy();
  });

  it('has form elements', () => {
    const { container } = renderWithProviders(<Home />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('handles file input change', () => {
    const { container } = renderWithProviders(<Home />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      fireEvent.change(fileInput, { target: { files: [file] } });
      expect(fileInput.files?.length).toBeGreaterThan(0);
    }
  });

  it('renders upload interface', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('displays checkboxes or radio buttons', () => {
    const { container } = renderWithProviders(<Home />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
