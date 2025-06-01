import WorkoutExercisesService from '../../src/services/workoutExercisesService';

jest.mock('../../src/services/BaseService');

WorkoutExercisesService.prototype.get = jest.fn();
WorkoutExercisesService.prototype.post = jest.fn();
WorkoutExercisesService.prototype.delete = jest.fn();

describe('WorkoutExercisesService', () => {
  let service;
  beforeEach(() => {
    service = new WorkoutExercisesService();
    service.get.mockClear();
    service.post.mockClear();
    service.delete.mockClear();
  });

  it('getWorkoutExercises returns exercises', async () => {
    service.get.mockResolvedValue([{ id: 1 }]);
    const result = await service.getWorkoutExercises(1);
    expect(service.get).toHaveBeenCalledWith('/1');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('addExerciseToWorkout posts data', async () => {
    service.post.mockResolvedValue({ id: 2 });
    const result = await service.addExerciseToWorkout({ foo: 'bar' });
    expect(service.post).toHaveBeenCalledWith('/', { foo: 'bar' });
    expect(result).toEqual({ id: 2 });
  });

  it('removeExerciseFromWorkout deletes data', async () => {
    service.delete.mockResolvedValue({ success: true });
    const result = await service.removeExerciseFromWorkout(3);
    expect(service.delete).toHaveBeenCalledWith('/3');
    expect(result).toEqual({ success: true });
  });
});
