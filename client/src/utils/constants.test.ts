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

  it('TOKEN_COOKIE_NAME should not be empty', () => {
    expect(TOKEN_COOKIE_NAME.trim()).not.toBe('');
  });

  it('REFRESH_TOKEN_COOKIE_NAME should not be empty', () => {
    expect(REFRESH_TOKEN_COOKIE_NAME.trim()).not.toBe('');
  });

  it('TOKEN_EXPIRATION_TIME_THRESHOLD should be reasonable', () => {
    expect(TOKEN_EXPIRATION_TIME_THRESHOLD).toBeGreaterThanOrEqual(0);
    expect(TOKEN_EXPIRATION_TIME_THRESHOLD).toBeLessThan(Number.MAX_SAFE_INTEGER);
  });

  it('constants should be defined and accessible', () => {
    const constants = {
      TOKEN_COOKIE_NAME,
      REFRESH_TOKEN_COOKIE_NAME,
      TOKEN_EXPIRATION_TIME_THRESHOLD
    };
    
    expect(Object.keys(constants).length).toBe(3);
    expect(constants.TOKEN_COOKIE_NAME).toBeTruthy();
    expect(constants.REFRESH_TOKEN_COOKIE_NAME).toBeTruthy();
    expect(constants.TOKEN_EXPIRATION_TIME_THRESHOLD).toBeDefined();
  });
});
