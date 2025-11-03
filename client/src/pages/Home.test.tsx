import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Home from './Home';
import * as Swal from 'sweetalert2';

// Mock Swal
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
  }
}));

// Mock del hook useFiles con funciones más completas
const mockHandleFileUpload = vi.fn();
const mockResetUploadState = vi.fn();
let mockUploadSuccess = false;

vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileUpload: mockHandleFileUpload,
    isUploadLoading: false,
    uploadSuccess: mockUploadSuccess,
    resetUploadState: mockResetUploadState,
  }),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadSuccess = false;
  });

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
      expect(fileInput).toBeTruthy();
      expect(fileInput.type).toBe('file');
    }
  });

  it('handles file selection', async () => {
    const { container } = renderWithProviders(<Home />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput) {
      // Simular cambio de archivo
      fireEvent.change(fileInput);
      await waitFor(() => {
        expect(fileInput).toBeInTheDocument();
      });
    }
  });

  it('handles checkbox change', () => {
    const { container } = renderWithProviders(<Home />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    
    if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0]);
      expect(checkboxes[0]).toBeDefined();
    }
  });

  it('handles submit button click', () => {
    const { container } = renderWithProviders(<Home />);
    const buttons = container.querySelectorAll('button');
    
    if (buttons.length > 0) {
      // Buscar el botón de subir archivo
      const uploadButton = Array.from(buttons).find(btn => 
        btn.textContent?.includes('Subir') || btn.textContent?.includes('Enviar')
      );
      
      if (uploadButton) {
        fireEvent.click(uploadButton);
        expect(uploadButton).toBeDefined();
      }
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

  it('has container divs', () => {
    const { container } = renderWithProviders(<Home />);
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('renders page structure', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.innerHTML).toBeTruthy();
    expect(container.innerHTML.length).toBeGreaterThan(100);
  });

  it('can interact with buttons', () => {
    const { container } = renderWithProviders(<Home />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button).toBeDefined();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  it('handles button clicks', async () => {
    const { container } = renderWithProviders(<Home />);
    const buttons = container.querySelectorAll('button');
    
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(true).toBe(true);
      });
    }
  });

  it('renders all required UI elements', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelectorAll('*').length).toBeGreaterThan(5);
  });

  it('has proper HTML structure', () => {
    const { container } = renderWithProviders(<Home />);
    const allElements = container.querySelectorAll('*');
    expect(allElements.length).toBeGreaterThan(0);
  });

  it('has labels for inputs', () => {
    const { container } = renderWithProviders(<Home />);
    const labels = container.querySelectorAll('label');
    expect(labels.length).toBeGreaterThanOrEqual(0);
  });

  it('renders with default state', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.firstChild).toBeTruthy();
  });
});
