import type { LoadOptions, LoadProgress } from '@/types/loader'
import type { Photo } from '@/types/photo'

import { parsePhotos } from './parsePhotos'

export const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos'

function readTotal(header: string | null): number | null {
  if (header === null) {
    return null
  }

  const total = Number(header)

  return Number.isFinite(total) && total > 0 ? total : null
}

async function request(signal: AbortSignal): Promise<Response> {
  try {
    return await fetch(PHOTOS_URL, { signal })
  } catch (error) {
    if (signal.aborted) {
      throw error
    }

    throw new Error('Не удалось соединиться с сервером. Проверьте подключение к сети.', {
      cause: error,
    })
  }
}

async function readBody(
  response: Response,
  onProgress: (progress: LoadProgress) => void,
): Promise<string> {
  const { body } = response

  if (body === null) {
    return response.text()
  }

  const reader = body.getReader()
  const decoder = new TextDecoder()
  let total = readTotal(response.headers.get('content-length'))
  let loaded = 0
  let text = ''

  for (;;) {
    const chunk = await reader.read()

    if (chunk.done) {
      break
    }

    loaded += chunk.value.length

    if (total !== null && loaded > total) {
      total = null
    }

    text += decoder.decode(chunk.value, { stream: true })
    onProgress({ loaded, total })
  }

  return text + decoder.decode()
}

function parseJson(text: string): unknown {
  try {
    const parsed: unknown = JSON.parse(text)

    return parsed
  } catch (error) {
    throw new Error('Ответ сервера не является корректным JSON.', { cause: error })
  }
}

export async function fetchPhotos({ signal, onProgress }: LoadOptions): Promise<Photo[]> {
  const response = await request(signal)

  if (!response.ok) {
    throw new Error(`Сервер ответил ошибкой ${response.status}.`)
  }

  const text = await readBody(response, onProgress)

  return parsePhotos(parseJson(text))
}
