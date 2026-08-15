import { useCallback, useEffect, useRef, useState } from 'react'

import type { JsonLoad, LoaderState } from '@/types/loader'

const FALLBACK_MESSAGE = 'Не удалось загрузить данные.'

function toMessage(error: unknown): string {
  if (error instanceof Error && error.message !== '') {
    return error.message
  }

  return FALLBACK_MESSAGE
}

export interface JsonLoader<T> {
  state: LoaderState<T>
  start: () => void
  cancel: () => void
}

export function useJsonLoader<T>(load: JsonLoad<T>): JsonLoader<T> {
  const [state, setState] = useState<LoaderState<T>>({ status: 'idle' })
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
      controllerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    controllerRef.current?.abort()

    const controller = new AbortController()
    controllerRef.current = controller
    setState({ status: 'loading', progress: { loaded: 0, total: null } })

    const isCurrent = () => controllerRef.current === controller

    load({
      signal: controller.signal,
      onProgress: (progress) => {
        if (isCurrent()) {
          setState({ status: 'loading', progress })
        }
      },
    })
      .then((data) => {
        if (!isCurrent()) {
          return
        }

        controllerRef.current = null
        setState({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!isCurrent()) {
          return
        }

        controllerRef.current = null
        setState(
          controller.signal.aborted
            ? { status: 'cancelled' }
            : { status: 'error', message: toMessage(error) },
        )
      })
  }, [load])

  const cancel = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  return { state, start, cancel }
}
