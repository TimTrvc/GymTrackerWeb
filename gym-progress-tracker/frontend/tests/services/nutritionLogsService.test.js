import * as nutritionLogsService from '../../src/services/nutritionLogsService';

jest.mock('../../src/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}));
import api from '../../src/services/api';

describe('nutritionLogsService', () => {
  beforeEach(() => {
    api.get.mockClear();
    api.post.mockClear();
    api.delete.mockClear();
  });

  it('getNutritionLogs returns data', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1 }] });
    const result = await nutritionLogsService.getNutritionLogs();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('addNutritionLog posts data', async () => {
    api.post.mockResolvedValue({ data: { id: 2 } });
    const result = await nutritionLogsService.addNutritionLog({ foo: 'bar' });
    expect(api.post).toHaveBeenCalledWith('/api/nutrition-logs', { foo: 'bar' });
    expect(result).toEqual({ id: 2 });
  });

  it('deleteNutritionLog deletes data', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const result = await nutritionLogsService.deleteNutritionLog(5);
    expect(api.delete).toHaveBeenCalledWith('/api/nutrition-logs/5');
    expect(result).toEqual({ success: true });
  });
});
