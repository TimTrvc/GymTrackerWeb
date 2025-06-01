import bodyMeasurementsService, { getBodyMeasurements, addBodyMeasurement } from '../../src/services/bodyMeasurementsService';

jest.mock('../../src/services/BaseService');

bodyMeasurementsService.get = jest.fn();
bodyMeasurementsService.post = jest.fn();
bodyMeasurementsService.delete = jest.fn();


describe('bodyMeasurementsService', () => {
  beforeEach(() => {
    bodyMeasurementsService.get.mockClear();
    bodyMeasurementsService.post.mockClear();
    bodyMeasurementsService.delete.mockClear();
  });

  it('getBodyMeasurements returns data', async () => {
    bodyMeasurementsService.get.mockResolvedValue([{ id: 1 }]);
    const result = await getBodyMeasurements();
    expect(bodyMeasurementsService.get).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  it('addBodyMeasurement posts data', async () => {
    bodyMeasurementsService.post.mockResolvedValue({ id: 2 });
    const result = await addBodyMeasurement({ foo: 'bar' });
    expect(bodyMeasurementsService.post).toHaveBeenCalledWith('', { foo: 'bar' });
    expect(result).toEqual({ id: 2 });
  });

  it('deleteBodyMeasurement deletes data', async () => {
    bodyMeasurementsService.delete.mockResolvedValue({ success: true });
    const result = await bodyMeasurementsService.deleteBodyMeasurement(5);
    expect(bodyMeasurementsService.delete).toHaveBeenCalledWith('/5');
    expect(result).toEqual({ success: true });
  });
});
