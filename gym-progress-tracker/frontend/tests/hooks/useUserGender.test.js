import { renderHook, act } from '@testing-library/react-hooks';
import useUserGender from '../../src/hooks/useUserGender';

jest.mock('../../src/services/userService', () => ({
  getUserDetails: jest.fn(() => Promise.resolve({ gender: 'f' }))
}));

describe('useUserGender', () => {
  beforeEach(() => {
    localStorage.setItem('userId', '123');
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('returns gender from API', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserGender());
    await waitForNextUpdate();
    expect(result.current.gender).toBe('f');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles missing userId', async () => {
    localStorage.removeItem('userId');
    const { result, waitForNextUpdate } = renderHook(() => useUserGender());
    await waitForNextUpdate();
    expect(result.current.error).toBeDefined();
  });
});
