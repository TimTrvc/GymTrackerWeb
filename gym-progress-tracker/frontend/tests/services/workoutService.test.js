import WorkoutService from '../../src/services/workoutService';

jest.mock('../../src/services/BaseService');

WorkoutService.prototype.get = jest.fn();
WorkoutService.prototype.post = jest.fn();
WorkoutService.prototype.put = jest.fn();
WorkoutService.prototype.delete = jest.fn();

describe('WorkoutService', () => {
  let service;
  beforeEach(() => {
    service = new WorkoutService();
    service.get.mockClear();
    service.post.mockClear();
    service.put.mockClear();
    service.delete.mockClear();
  });

  it('getAllWorkouts returns workouts', async () => {
    service.get.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAllWorkouts();
    expect(service.get).toHaveBeenCalledWith('/');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('addWorkout posts data', async () => {
    service.post.mockResolvedValue({ id: 2 });
    const result = await service.addWorkout({ foo: 'bar' });
    expect(service.post).toHaveBeenCalledWith('/', { foo: 'bar' });
    expect(result).toEqual({ id: 2 });
  });

  it('updateWorkout puts data', async () => {
    service.put.mockResolvedValue({ id: 3 });
    const result = await service.updateWorkout(3, { name: 'Test' });
    expect(service.put).toHaveBeenCalledWith('/3', { name: 'Test' });
    expect(result).toEqual({ id: 3 });
  });
});
