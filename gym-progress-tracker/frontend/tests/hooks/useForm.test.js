import { renderHook, act } from '@testing-library/react-hooks';
import { useForm } from '../../src/hooks/useForm';

describe('useForm', () => {
  it('initializes with values', () => {
    const { result } = renderHook(() => useForm({ name: 'Tim' }));
    expect(result.current.values.name).toBe('Tim');
  });

  it('updates value on change', () => {
    const { result } = renderHook(() => useForm({ name: '' }));
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'Max', type: 'text' } });
    });
    expect(result.current.values.name).toBe('Max');
  });

  it('calls onSubmit if valid', () => {
    const onSubmit = jest.fn();
    const validate = () => ({ isValid: true, errors: {} });
    const { result } = renderHook(() => useForm({ name: '' }, validate, onSubmit));
    act(() => {
      result.current.handleSubmit({ preventDefault: () => {} });
    });
    expect(onSubmit).toHaveBeenCalled();
  });
});
