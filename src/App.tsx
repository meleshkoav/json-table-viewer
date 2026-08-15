import { useMemo } from 'react'

import { PhotoTable } from '@/components/PhotoTable'
import { generatePhotos } from '@/mocks/photos'

const MOCK_PHOTOS_COUNT = 5000

export function App() {
  const photos = useMemo(() => generatePhotos(MOCK_PHOTOS_COUNT), [])

  return (
    <main>
      <h1>JSON Table Viewer</h1>
      <PhotoTable photos={photos} />
    </main>
  )
}
