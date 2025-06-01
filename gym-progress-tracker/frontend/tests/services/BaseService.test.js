import BaseService from '../../src/services/BaseService';

jest.mock('../../src/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));
import api from '../../src/services/api';

describe('BaseService', () => {
  let service;
  beforeEach(() => {
    service = new BaseService('/test');
    api.get.mockClear();
    api.post.mockClear();
    api.put.mockClear();
    api.delete.mockClear();
  });

  it('endpoint returns correct path', () => {
    expect(service.endpoint('foo')).toBe('/test/foo');
    expect(service.endpoint()).toBe('/test');
  });

  it('get calls api.get', async () => {
    api.get.mockResolvedValue({ data: 1 });
    const result = await service.get('foo');
    expect(api.get).toHaveBeenCalledWith('/test/foo');
    expect(result).toBe(1);
  });

  it('post calls api.post', async () => {
    api.post.mockResolvedValue({ data: 2 });
    const result = await service.post('bar', { a: 1 });
    expect(api.post).toHaveBeenCalledWith('/test/bar', { a: 1 });
    expect(result).toBe(2);
  });

  it('put calls api.put', async () => {
    api.put.mockResolvedValue({ data: 3 });
    const result = await service.put('baz', { b: 2 });
    expect(api.put).toHaveBeenCalledWith('/test/baz', { b: 2 });
    expect(result).toBe(3);
  });

  it('delete calls api.delete', async () => {
    api.delete.mockResolvedValue({ data: 4 });
    const result = await service.delete('id');
    expect(api.delete).toHaveBeenCalledWith('/test/id');
    expect(result).toBe(4);
  });
});
