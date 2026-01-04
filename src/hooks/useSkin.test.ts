import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSkin } from './useSkin';

describe('useSkin', () => {
  it('should always return "retro"', () => {
    const { result } = renderHook(() => useSkin());
    expect(result.current).toBe('retro');
  });
});