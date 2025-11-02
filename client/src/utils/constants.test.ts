import { describe, it, expect } from 'vitest';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, TOKEN_EXPIRATION_TIME_THRESHOLD } from './constants';

describe('Constants', () => {
  it('should export TOKEN_COOKIE_NAME constant', () => {
    expect(TOKEN_COOKIE_NAME).toBeDefined();
    expect(typeof TOKEN_COOKIE_NAME).toBe('string');
    expect(TOKEN_COOKIE_NAME.length).toBeGreaterThan(0);
  });

  it('should export REFRESH_TOKEN_COOKIE_NAME constant', () => {
    expect(REFRESH_TOKEN_COOKIE_NAME).toBeDefined();
    expect(typeof REFRESH_TOKEN_COOKIE_NAME).toBe('string');
    expect(REFRESH_TOKEN_COOKIE_NAME.length).toBeGreaterThan(0);
  });

  it('should export TOKEN_EXPIRATION_TIME_THRESHOLD constant', () => {
    expect(TOKEN_EXPIRATION_TIME_THRESHOLD).toBeDefined();
    expect(typeof TOKEN_EXPIRATION_TIME_THRESHOLD).toBe('number');
  });

  it('TOKEN_COOKIE_NAME and REFRESH_TOKEN_COOKIE_NAME should be different', () => {
    expect(TOKEN_COOKIE_NAME).not.toBe(REFRESH_TOKEN_COOKIE_NAME);
  });

  it('TOKEN_EXPIRATION_TIME_THRESHOLD should be a positive number', () => {
    expect(TOKEN_EXPIRATION_TIME_THRESHOLD).toBeGreaterThan(0);
  });
});


