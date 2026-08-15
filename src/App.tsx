import { useMemo, useState } from 'react'

import { PhotoTable } from '@/components/PhotoTable'
import { SearchInput } from '@/components/SearchInput'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useFilteredPhotos } from '@/hooks/useFilteredPhotos'
import { generatePhotos } from '@/mocks/photos'

const MOCK_PHOTOS_COUNT = 5000
const SEARCH_DELAY = 300

export function App() {
  const photos = useMemo(() => generatePhotos(MOCK_PHOTOS_COUNT), [])
  const [query, setQuery] = useState('')
  const search = useDebouncedValue(query, SEARCH_DELAY).trim()
  const filtered = useFilteredPhotos(photos, search)

  return (
    <main>
      <h1>JSON Table Viewer</h1>
      <SearchInput onChange={setQuery} value={query} />
      <p>
        Найдено: {filtered.length} из {photos.length}
      </p>
      {filtered.length > 0 ? (
        <PhotoTable photos={filtered} query={search} />
      ) : (
        <p>Ничего не найдено. Попробуйте изменить запрос.</p>
      )}
    </main>
  )
}
