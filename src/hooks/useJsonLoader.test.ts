import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { JsonLoad, LoadProgress } from '@/types/loader'

import { useJsonLoader } from './useJsonLoader'

interface Run {
  signal: AbortSignal
  onProgress: (progress: LoadProgress) => void
  resolve: (data: string[]) => void
  reject: (error: unknown) => void
}

interface FakeLoader {
  load: JsonLoad<string[]>
  emitProgress: (progress: LoadProgress) => void
  finish: (data: string[]) => void
  unwindAfterAbort: () => void
}

function createFakeLoader(): FakeLoader {
  let run: Run | null = null
  let aborted = false

  const current = (): Run => {
    if (run === null) {
      throw new Error('Загрузка ещё не начиналась.')
    }

    return run
  }

  const load: JsonLoad<string[]> = ({ signal, onProgress }) =>
    new Promise<string[]>((resolve, reject) => {
      run = { signal, onProgress, resolve, reject }
      signal.addEventListener('abort', () => {
        aborted = true
      })
    })

  return {
    load,
    emitProgress: (progress) => {
      current().onProgress(progress)
    },
    finish: (data) => {
      current().resolve(data)
    },
    unwindAfterAbort: () => {
      if (!aborted) {
        throw new Error('Загрузчик не получал сигнала отмены.')
      }

      current().reject(new DOMException('Загрузка отменена.', 'AbortError'))
    },
  }
}

async function settleLoader(action: () => void): Promise<void> {
  await act(async () => {
    action()
    await Promise.resolve()
  })
}

describe('useJsonLoader', () => {
  it('доводит загрузку до success, пробрасывая прогресс', async () => {
    const fake = createFakeLoader()
    const { result } = renderHook(() => useJsonLoader(fake.load))

    expect(result.current.state).toEqual({ status: 'idle' })

    act(() => {
      result.current.start()
    })

    expect(result.current.state).toEqual({
      status: 'loading',
      progress: { loaded: 0, total: null },
    })

    act(() => {
      fake.emitProgress({ loaded: 1024, total: 4096 })
    })

    expect(result.current.state).toEqual({
      status: 'loading',
      progress: { loaded: 1024, total: 4096 },
    })

    await settleLoader(() => {
      fake.finish(['accusamus', 'reprehenderit'])
    })

    expect(result.current.state).toEqual({
      status: 'success',
      data: ['accusamus', 'reprehenderit'],
    })
  })

  it('после отмены переходит в cancelled, а не в error', async () => {
    const fake = createFakeLoader()
    const { result } = renderHook(() => useJsonLoader(fake.load))

    act(() => {
      result.current.start()
    })

    act(() => {
      fake.emitProgress({ loaded: 1024, total: null })
    })

    await settleLoader(() => {
      result.current.cancel()
      fake.unwindAfterAbort()
    })

    expect(result.current.state).toEqual({ status: 'cancelled' })
  })

  it('не возвращается в loading от прогресса отменённого запуска', async () => {
    const fake = createFakeLoader()
    const { result } = renderHook(() => useJsonLoader(fake.load))

    act(() => {
      result.current.start()
    })

    act(() => {
      fake.emitProgress({ loaded: 1024, total: null })
    })

    act(() => {
      result.current.cancel()
    })

    act(() => {
      fake.emitProgress({ loaded: 4096, total: null })
    })

    expect(result.current.state).toEqual({
      status: 'loading',
      progress: { loaded: 1024, total: null },
    })

    await settleLoader(() => {
      fake.unwindAfterAbort()
    })

    expect(result.current.state).toEqual({ status: 'cancelled' })
  })
})
