import trainingSessionsService, { addTrainingSession, getTrainingSessions } from '../../src/services/trainingSessionsService';

jest.mock('../../src/services/BaseService');

trainingSessionsService.get = jest.fn();
trainingSessionsService.post = jest.fn();

describe('trainingSessionsService', () => {
  beforeEach(() => {
    trainingSessionsService.get.mockClear();
    trainingSessionsService.post.mockClear();
  });

  it('getAllSessions returns sessions', async () => {
    trainingSessionsService.get.mockResolvedValue([{ id: 1 }]);
    const result = await getTrainingSessions();
    expect(trainingSessionsService.get).toHaveBeenCalledWith('/');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('addSession posts data', async () => {
    trainingSessionsService.post.mockResolvedValue({ id: 2 });
    const result = await addTrainingSession({ foo: 'bar' });
    expect(trainingSessionsService.post).toHaveBeenCalledWith('', { foo: 'bar' });
    expect(result).toEqual({ id: 2 });
  });
});
