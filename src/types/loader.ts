export interface LoadProgress {
  loaded: number
  total: number | null
}

export interface LoadOptions {
  signal: AbortSignal
  onProgress: (progress: LoadProgress) => void
}

export type JsonLoad<T> = (options: LoadOptions) => Promise<T>

export type LoaderState<T> =
  | { status: 'idle' }
  | { status: 'loading'; progress: LoadProgress }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
  | { status: 'cancelled' }
