import { createColumnHelper, tableFeatures } from '@tanstack/react-table'

import type { Photo } from '@/types/photo'

export const features = tableFeatures({})

const helper = createColumnHelper<typeof features, Photo>()

export const columns = helper.columns([
  helper.accessor('id', { header: 'ID' }),
  helper.accessor('albumId', { header: 'Альбом' }),
  helper.accessor('title', { header: 'Название' }),
  helper.accessor('url', { header: 'Ссылка' }),
  helper.accessor('thumbnailUrl', { header: 'Превью' }),
])
