import ActivityTrackerService from '../../src/services/activityTrackerService';
import avatarService from '../../src/services/avatarService';

jest.mock('../../src/services/avatarService');

ActivityTrackerService.prototype.logActivity = jest.fn();

describe('ActivityTrackerService', () => {
  let service;
  beforeEach(() => {
    service = new ActivityTrackerService('/api/activity');
    ActivityTrackerService.prototype.logActivity.mockClear();
    avatarService.addExperience.mockClear();
  });

  it('trackWorkoutCompletion rewards XP and logs activity', async () => {
    avatarService.addExperience.mockResolvedValue({ leveledUp: true });
    const result = await service.trackWorkoutCompletion(1, 5);
    expect(avatarService.addExperience).toHaveBeenCalled();
    expect(ActivityTrackerService.prototype.logActivity).toHaveBeenCalledWith('workout_completion', expect.objectContaining({ workoutId: 1, exerciseCount: 5 }));
    expect(result.leveledUp).toBe(true);
  });
});
