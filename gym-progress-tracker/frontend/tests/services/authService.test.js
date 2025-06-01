import AuthService, { AUTH_KEYS } from '../../src/services/authService';

describe('AuthService', () => {
  let service;
  beforeEach(() => {
    service = new AuthService('/api/auth');
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  it('saveAuthData stores token and user info', () => {
    const authData = { token: 'abc', user: { id: 1, username: 'tim' } };
    // Use the internal function via prototype (simulate call)
    service.constructor.__proto__.saveAuthData?.(authData, true);
    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEYS.TOKEN, 'abc');
    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEYS.USER_ID, 1);
    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEYS.USERNAME, 'tim');
    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_KEYS.REMEMBER_ME, 'true');
  });
});
