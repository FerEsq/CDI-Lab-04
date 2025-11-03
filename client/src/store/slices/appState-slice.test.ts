import { describe, it, expect } from 'vitest';
import appStateReducer, { setAppState } from './appState-slice';

describe('appState slice', () => {
  it('should return the initial state', () => {
    const state = appStateReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      state: 'NOT_LOGGED_IN',
    });
  });

  it('should handle setAppState to LOGGED_IN', () => {
    const initialState = { state: 'NOT_LOGGED_IN' as const };
    const actual = appStateReducer(initialState, setAppState('LOGGED_IN'));
    expect(actual.state).toBe('LOGGED_IN');
  });

  it('should handle setAppState to NOT_LOGGED_IN', () => {
    const initialState = { state: 'LOGGED_IN' as const };
    const actual = appStateReducer(initialState, setAppState('NOT_LOGGED_IN'));
    expect(actual.state).toBe('NOT_LOGGED_IN');
  });

  it('should toggle state from LOGGED_IN to NOT_LOGGED_IN', () => {
    let state = { state: 'LOGGED_IN' as const };
    state = appStateReducer(state, setAppState('NOT_LOGGED_IN'));
    expect(state.state).toBe('NOT_LOGGED_IN');
    
    state = appStateReducer(state, setAppState('LOGGED_IN'));
    expect(state.state).toBe('LOGGED_IN');
  });

  it('should maintain state when setting to same value', () => {
    const initialState = { state: 'LOGGED_IN' as const };
    const actual = appStateReducer(initialState, setAppState('LOGGED_IN'));
    expect(actual.state).toBe('LOGGED_IN');
  });

  it('should handle multiple state changes', () => {
    let state = { state: 'NOT_LOGGED_IN' as const };
    
    state = appStateReducer(state, setAppState('LOGGED_IN'));
    expect(state.state).toBe('LOGGED_IN');
    
    state = appStateReducer(state, setAppState('NOT_LOGGED_IN'));
    expect(state.state).toBe('NOT_LOGGED_IN');
    
    state = appStateReducer(state, setAppState('LOGGED_IN'));
    expect(state.state).toBe('LOGGED_IN');
  });

  it('should be a valid reducer function', () => {
    expect(typeof appStateReducer).toBe('function');
    expect(appStateReducer.length).toBeGreaterThanOrEqual(0);
  });
});
