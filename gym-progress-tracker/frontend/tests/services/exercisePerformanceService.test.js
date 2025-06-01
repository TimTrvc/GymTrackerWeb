import exercisePerformanceService, { addExercisePerformance, getExercisePerformances } from '../../src/services/exercisePerformanceService';

jest.mock('../../src/services/BaseService');

exercisePerformanceService.post = jest.fn();
exercisePerformanceService.get = jest.fn();

describe('exercisePerformanceService', () => {
  beforeEach(() => {
    exercisePerformanceService.post.mockClear();
    exercisePerformanceService.get.mockClear();
  });

  it('addPerformance calls post', async () => {
    exercisePerformanceService.post.mockResolvedValue({ id: 1 });
    const result = await addExercisePerformance({ reps: 10 });
    expect(exercisePerformanceService.post).toHaveBeenCalledWith('', { reps: 10 });
    expect(result).toEqual({ id: 1 });
  });

  it('getExercisePerformances calls get', async () => {
    exercisePerformanceService.get.mockResolvedValue([{ id: 1 }]);
    const result = await getExercisePerformances(5);
    expect(exercisePerformanceService.get).toHaveBeenCalledWith('/5');
    expect(result).toEqual([{ id: 1 }]);
  });
});
