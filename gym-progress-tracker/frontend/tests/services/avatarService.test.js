import AvatarService from '../../src/services/avatarService';

jest.mock('../../src/services/BaseService');

AvatarService.prototype.get = jest.fn();
AvatarService.prototype.put = jest.fn();
AvatarService.prototype.post = jest.fn();


describe('AvatarService', () => {
  let service;
  beforeEach(() => {
    service = new AvatarService();
    service.get.mockClear();
    service.put.mockClear();
    service.post.mockClear();
  });

  it('getUserAvatar calls get', async () => {
    service.get.mockResolvedValue({ name: 'Ava' });
    const result = await service.getUserAvatar();
    expect(service.get).toHaveBeenCalled();
    expect(result).toEqual({ name: 'Ava' });
  });

  it('updateAvatarStats calls put', async () => {
    service.put.mockResolvedValue({ hp: 10 });
    const stats = { hp: 10, mp: 5, attack: 2, defense: 1, agility: 3 };
    await service.updateAvatarStats(stats);
    expect(service.put).toHaveBeenCalled();
  });

  it('addExperience calls post', async () => {
    service.post.mockResolvedValue({ avatar: { xp: 10 }, leveledUp: true });
    await service.addExperience(10);
    expect(service.post).toHaveBeenCalled();
  });
});
