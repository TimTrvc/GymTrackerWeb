import api from '../../src/services/api';

describe('api', () => {
  it('should be an axios instance', () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
  });

  it('should add Authorization header if token exists', async () => {
    localStorage.setItem('token', 'testtoken');
    const config = { headers: {} };
    const req = await api.interceptors.request.handlers[0].fulfilled(config);
    expect(req.headers.Authorization).toBe('Bearer testtoken');
  });

  it('should not add Authorization header if no token', async () => {
    localStorage.removeItem('token');
    const config = { headers: {} };
    const req = await api.interceptors.request.handlers[0].fulfilled(config);
    expect(req.headers.Authorization).toBeUndefined();
  });
});
