import emailService, { subscribeToNewsletter } from '../../src/services/emailService';

jest.mock('../../src/services/BaseService');

emailService.post = jest.fn();

describe('emailService', () => {
  beforeEach(() => {
    emailService.post.mockClear();
  });

  it('subscribeToNewsletter calls post', async () => {
    emailService.post.mockResolvedValue({ success: true });
    const result = await subscribeToNewsletter('test@example.com');
    expect(emailService.post).toHaveBeenCalledWith('', { email: 'test@example.com' });
    expect(result).toEqual({ success: true });
  });
});
