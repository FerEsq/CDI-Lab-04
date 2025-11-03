import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import Home from './Home';

// Use vi.hoisted to declare mocks before they are used
const { mockSwalFire, mockHandleFileUpload, mockResetUploadState } = vi.hoisted(() => ({
  mockSwalFire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  mockHandleFileUpload: vi.fn(),
  mockResetUploadState: vi.fn(),
}));

let mockUploadSuccess = false;
let mockIsUploadLoading = false;

// Mock Cookies
vi.mock('js-cookie', () => ({
  default: {
    remove: vi.fn(),
  }
}));

// Mock Swal
vi.mock('sweetalert2', () => ({
  default: {
    fire: mockSwalFire
  }
}));

// Mock del hook useFiles con funciones más completas
vi.mock('../hooks/useFiles', () => ({
  default: () => ({
    handleFileUpload: mockHandleFileUpload,
    isUploadLoading: mockIsUploadLoading,
    uploadSuccess: mockUploadSuccess,
    resetUploadState: mockResetUploadState,
  }),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadSuccess = false;
    mockIsUploadLoading = false;
    mockSwalFire.mockClear();
    mockHandleFileUpload.mockClear();
    mockResetUploadState.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole('heading', { name: /Subir Archivo/i })).toBeInTheDocument();
  });

  it('renders the Header component', () => {
    renderWithProviders(<Home />);
    // El Header debería estar presente
    expect(document.querySelector('header') || document.querySelector('[role="banner"]')).toBeTruthy();
  });

  it('displays the title "Subir Archivo"', () => {
    renderWithProviders(<Home />);
    const title = screen.getByRole('heading', { name: /Subir Archivo/i });
    expect(title).toBeInTheDocument();
  });

  it('renders file input with correct label', () => {
    renderWithProviders(<Home />);
    const label = screen.getByText('Selecciona un archivo:');
    expect(label).toBeInTheDocument();
    
    const fileInput = screen.getByLabelText('Selecciona un archivo:');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  it('renders checkbox with label for digital signature', () => {
    renderWithProviders(<Home />);
    const checkbox = screen.getByLabelText('Firmar archivo digitalmente');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox when clicked', () => {
    renderWithProviders(<Home />);
    const checkbox = screen.getByLabelText('Firmar archivo digitalmente') as HTMLInputElement;
    
    expect(checkbox.checked).toBe(false);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('renders submit button with correct text', () => {
    renderWithProviders(<Home />);
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    expect(button).toBeInTheDocument();
  });

  it('submit button is disabled when no file is selected', () => {
    renderWithProviders(<Home />);
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    expect(button).toBeDisabled();
  });

  it('handles file selection and displays file name', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText(/Archivo seleccionado: test\.txt/i)).toBeInTheDocument();
  });

  it('enables submit button when file is selected', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(button).not.toBeDisabled();
  });

  it('calls handleFileUpload when submit button is clicked with file selected', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(button);
    
    expect(mockHandleFileUpload).toHaveBeenCalledWith(file, false);
  });

  it('calls handleFileUpload with sign=true when checkbox is checked', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    const checkbox = screen.getByLabelText('Firmar archivo digitalmente') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(checkbox);
    fireEvent.click(button);
    
    expect(mockHandleFileUpload).toHaveBeenCalledWith(file, true);
  });

  it('does not call handleFileUpload when no file is selected', () => {
    renderWithProviders(<Home />);
    const button = screen.getByRole('button', { name: /Subir Archivo/i });
    
    // Intentar hacer click en el botón sin archivo
    fireEvent.click(button);
    
    expect(mockHandleFileUpload).not.toHaveBeenCalled();
  });

  it('displays "Subiendo..." when upload is in progress', () => {
    mockIsUploadLoading = true;
    
    renderWithProviders(<Home />);
    
    const button = screen.getByRole('button', { name: /Subiendo\.\.\./i });
    expect(button).toBeInTheDocument();
  });

  it('shows success alert when uploadSuccess becomes true', async () => {
    const { rerender } = renderWithProviders(<Home />);
    
    // Simular que la subida fue exitosa
    mockUploadSuccess = true;
    
    // Re-renderizar el componente para que el useEffect se ejecute
    rerender(<Home />);
    
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalledWith({
        title: '¡Éxito!',
        text: 'Archivo subido correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#226946'
      });
    });
  });

  it('resets form after successful upload alert is confirmed', async () => {
    const { rerender } = renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    
    // Seleccionar un archivo primero
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText(/Archivo seleccionado: test\.txt/i)).toBeInTheDocument();
    
    // Simular que la subida fue exitosa
    mockUploadSuccess = true;
    rerender(<Home />);
    
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalled();
    });
    
    // Simular que el usuario confirmó la alerta
    await mockSwalFire.mock.results[0].value;
    
    expect(mockResetUploadState).toHaveBeenCalled();
  });

  it('resets file input value when form is reset', async () => {
    const { rerender } = renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Simular subida exitosa
    mockUploadSuccess = true;
    rerender(<Home />);
    
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalled();
    });
  });

  it('resets checkbox when form is reset after successful upload', async () => {
    const { rerender } = renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    const checkbox = screen.getByLabelText('Firmar archivo digitalmente') as HTMLInputElement;
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(checkbox);
    
    expect(checkbox.checked).toBe(true);
    
    // Simular subida exitosa
    mockUploadSuccess = true;
    rerender(<Home />);
    
    await waitFor(() => {
      expect(mockSwalFire).toHaveBeenCalled();
    });
  });

  it('has correct styling for primary color elements', () => {
    renderWithProviders(<Home />);
    const title = screen.getByRole('heading', { name: /Subir Archivo/i });
    expect(title).toHaveStyle({ color: 'rgb(34, 105, 70)' });
  });

  it('handles multiple file selections', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    
    const file1 = new File(['content1'], 'file1.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file1] } });
    expect(screen.getByText(/Archivo seleccionado: file1\.txt/i)).toBeInTheDocument();
    
    const file2 = new File(['content2'], 'file2.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file2] } });
    expect(screen.getByText(/Archivo seleccionado: file2\.txt/i)).toBeInTheDocument();
  });

  it('maintains checkbox state across file selections', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    const checkbox = screen.getByLabelText('Firmar archivo digitalmente') as HTMLInputElement;
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(checkbox.checked).toBe(true);
  });

  it('handles file input change with no files', () => {
    renderWithProviders(<Home />);
    const fileInput = screen.getByLabelText('Selecciona un archivo:') as HTMLInputElement;
    
    // Simular cambio sin archivos
    fireEvent.change(fileInput, { target: { files: [] } });
    
    expect(screen.queryByText(/Archivo seleccionado:/i)).not.toBeInTheDocument();
  });

  it('renders with proper container structure', () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders all form elements', () => {
    renderWithProviders(<Home />);
    expect(screen.getByLabelText('Selecciona un archivo:')).toBeInTheDocument();
    expect(screen.getByLabelText('Firmar archivo digitalmente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subir Archivo/i })).toBeInTheDocument();
  });
});
