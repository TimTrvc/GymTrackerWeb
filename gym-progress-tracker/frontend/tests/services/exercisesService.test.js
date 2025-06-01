import ExercisesService from '../../src/services/exercisesService';

jest.mock('../../src/services/BaseService');

const mockGet = jest.fn();
ExercisesService.prototype.get = mockGet;

describe('ExercisesService', () => {
  let service;
  beforeEach(() => {
    service = new ExercisesService();
    mockGet.mockClear();
  });

  it('calls getByCategory with numeric id', async () => {
    mockGet.mockResolvedValue([{ id: 1 }]);
    await service.getByCategory(5);
    expect(mockGet).toHaveBeenCalledWith('category/5');
  });

  it('calls getByCategory with string id', async () => {
    mockGet.mockResolvedValue([{ id: 2 }]);
    await service.getByCategory('7');
    expect(mockGet).toHaveBeenCalledWith('category/7');
  });

  it('throws on invalid string category', async () => {
    await expect(service.getByCategory('invalid')).rejects.toThrow();
  });
});
