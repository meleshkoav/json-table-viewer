import { useMemo } from 'react'

import type { Photo } from '@/types/photo'

export const SEARCH_FIELD = 'title' satisfies keyof Photo

export function useFilteredPhotos(photos: Photo[], search: string): Photo[] {
  return useMemo(() => {
    if (search === '') {
      return photos
    }

    const needle = search.toLowerCase()

    return photos.filter((photo) => photo[SEARCH_FIELD].toLowerCase().includes(needle))
  }, [photos, search])
}
