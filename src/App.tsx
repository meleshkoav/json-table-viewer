import { useState } from 'react'

import { fetchPhotos } from '@/api/fetchPhotos'
import { PhotoTable } from '@/components/PhotoTable'
import { SearchInput } from '@/components/SearchInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useFilteredPhotos } from '@/hooks/useFilteredPhotos'
import { useJsonLoader } from '@/hooks/useJsonLoader'
import type { LoaderState } from '@/types/loader'
import type { Photo } from '@/types/photo'

const SEARCH_DELAY = 300
const NO_PHOTOS: Photo[] = []

function formatBytes(bytes: number): string {
  return `${bytes.toLocaleString('ru-RU')} Б`
}

function describeState(state: LoaderState<Photo[]>): string {
  switch (state.status) {
    case 'idle':
      return 'Данные не загружены.'
    case 'loading': {
      const { loaded, total } = state.progress

      if (total === null) {
        return `Загрузка… прочитано ${formatBytes(loaded)}`
      }

      const percent = Math.round((loaded / total) * 100)

      return `Загрузка… ${percent}% — ${formatBytes(loaded)} из ${formatBytes(total)}`
    }
    case 'success':
      return `Загружено записей: ${state.data.length}`
    case 'error':
      return `Ошибка: ${state.message}`
    case 'cancelled':
      return 'Загрузка отменена.'
  }
}

export function App() {
  const { state, start, cancel } = useJsonLoader(fetchPhotos)
  const [query, setQuery] = useState('')
  const search = useDebouncedValue(query, SEARCH_DELAY).trim()
  const photos = state.status === 'success' ? state.data : NO_PHOTOS
  const filtered = useFilteredPhotos(photos, search)

  return (
    <main>
      <h1>JSON Table Viewer</h1>

      <div>
        <button disabled={state.status === 'loading'} onClick={start} type="button">
          Загрузить
        </button>
        <button disabled={state.status !== 'loading'} onClick={cancel} type="button">
          Отмена
        </button>
      </div>

      <p>{describeState(state)}</p>

      {state.status === 'success' && (
        <>
          <SearchInput onChange={setQuery} value={query} />
          <p>
            Найдено: {filtered.length} из {photos.length}
          </p>
          {filtered.length > 0 ? (
            <PhotoTable photos={filtered} query={search} />
          ) : (
            <p>Ничего не найдено. Попробуйте изменить запрос.</p>
          )}
        </>
      )}
    </main>
  )
}
