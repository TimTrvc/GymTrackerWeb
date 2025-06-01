import exerciseCategoriesService, { getExerciseCategories } from '../../src/services/exerciseCategoriesService';

jest.mock('../../src/services/BaseService');

exerciseCategoriesService.get = jest.fn();

describe('exerciseCategoriesService', () => {
  beforeEach(() => {
    exerciseCategoriesService.get.mockClear();
  });

  it('getExerciseCategories returns categories', async () => {
    exerciseCategoriesService.get.mockResolvedValue([{ id: 1 }]);
    const result = await getExerciseCategories();
    expect(exerciseCategoriesService.get).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('handles error in getExerciseCategories', async () => {
    exerciseCategoriesService.get.mockRejectedValue(new Error('fail'));
    exerciseCategoriesService.handleError = jest.fn();
    await exerciseCategoriesService.getExerciseCategories();
    expect(exerciseCategoriesService.handleError).toHaveBeenCalled();
  });
});
