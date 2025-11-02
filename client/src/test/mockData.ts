import { FileItem } from '../store/api/api-slice';

export const mockFileItem: FileItem = {
  _id: 'test-file-id',
  filename: 'test-file.txt',
  created_at: '2025-01-01T00:00:00Z',
  original_name: 'test-file.txt',
  is_signed: true,
  mime_type: 'text/plain',
  owner_id: 'test-owner-id',
  signature: 'test-signature',
  signed_at: '2025-01-01T00:00:00Z',
  size: 1024,
};

export const mockAuthResponse = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  access_token_expiration_time: '3600000',
  refresh_token_expiration_time: '7200000',
};

export const mockFile = new File(['test content'], 'test.txt', {
  type: 'text/plain',
});


