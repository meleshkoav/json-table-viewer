import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from './useDebouncedValue'

const DELAY = 300

function renderDebounced(initial: string) {
  return renderHook(({ value }) => useDebouncedValue(value, DELAY), {
    initialProps: { value: initial },
  })
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedValue', () => {
  it('отдаёт начальное значение сразу', () => {
    const { result } = renderDebounced('accusamus')

    expect(result.current).toBe('accusamus')
  })

  it('держит прежнее значение, пока задержка не истекла', () => {
    const { result, rerender } = renderDebounced('accusamus')

    rerender({ value: 'reprehenderit' })
    act(() => {
      vi.advanceTimersByTime(DELAY - 1)
    })

    expect(result.current).toBe('accusamus')

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBe('reprehenderit')
  })

  it('на серии быстрых правок отдаёт только последнюю', () => {
    const { result, rerender } = renderDebounced('accusamus')

    rerender({ value: 'repreh' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    rerender({ value: 'reprehenderit' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('accusamus')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('reprehenderit')
  })
})
