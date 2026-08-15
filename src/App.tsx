import { useState } from 'react'

import { fetchPhotos } from '@/api/fetchPhotos'
import { LoaderPanel } from '@/components/LoaderPanel'
import { PhotoTable } from '@/components/PhotoTable'
import { SearchInput } from '@/components/SearchInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useFilteredPhotos } from '@/hooks/useFilteredPhotos'
import { useJsonLoader } from '@/hooks/useJsonLoader'
import type { Photo } from '@/types/photo'

import styles from './App.module.css'

const SEARCH_DELAY = 300
const NO_PHOTOS: Photo[] = []

export function App() {
  const { state, start, cancel } = useJsonLoader(fetchPhotos)
  const [query, setQuery] = useState('')
  const search = useDebouncedValue(query, SEARCH_DELAY).trim()
  const photos = state.status === 'success' ? state.data : NO_PHOTOS
  const filtered = useFilteredPhotos(photos, search)

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>JSON Table Viewer</h1>

      <LoaderPanel onCancel={cancel} onStart={start} state={state} />

      {state.status === 'success' && (
        <section className={styles.results}>
          <SearchInput onChange={setQuery} value={query} />
          <p className={styles.counter} role="status">
            Найдено: {filtered.length.toLocaleString('ru-RU')} из{' '}
            {photos.length.toLocaleString('ru-RU')}
          </p>
          {filtered.length > 0 ? (
            <PhotoTable photos={filtered} query={search} />
          ) : (
            <p className={styles.empty}>Ничего не найдено. Попробуйте изменить запрос.</p>
          )}
        </section>
      )}
    </main>
  )
}
