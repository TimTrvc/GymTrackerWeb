import { renderHook, act } from '@testing-library/react-hooks';
import useAvatar from '../../src/hooks/useAvatar';

jest.mock('../../src/services/avatarService', () => ({
  getUserAvatar: jest.fn(() => Promise.resolve({ name: 'TestAvatar' })),
  addExperience: jest.fn(() => Promise.resolve({ avatar: { name: 'TestAvatar', xp: 10 }, leveledUp: false }))
}));

describe('useAvatar', () => {
  it('fetches avatar on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAvatar());
    await waitForNextUpdate();
    expect(result.current.avatar).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it('adds experience', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAvatar());
    await waitForNextUpdate();
    await act(async () => {
      await result.current.addExperience(10);
    });
    expect(result.current.avatar.xp).toBe(10);
  });
});
