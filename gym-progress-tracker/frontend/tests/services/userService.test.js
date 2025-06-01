import UserService from '../../src/services/userService';

jest.mock('../../src/services/BaseService');

UserService.prototype.get = jest.fn();
UserService.prototype.put = jest.fn();


describe('UserService', () => {
  let service;
  beforeEach(() => {
    service = new UserService();
    service.get.mockClear();
    service.put.mockClear();
  });

  it('getUserDetails returns user', async () => {
    service.get.mockResolvedValue({ user: { id: 1 } });
    const result = await service.getUserDetails(1);
    expect(service.get).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: 1 });
  });

  it('updateUserDetails calls put', async () => {
    service.put.mockResolvedValue({ id: 2 });
    const result = await service.updateUserDetails(2, { name: 'Tim' });
    expect(service.put).toHaveBeenCalledWith('2', { name: 'Tim' });
    expect(result).toEqual({ id: 2 });
  });
});
