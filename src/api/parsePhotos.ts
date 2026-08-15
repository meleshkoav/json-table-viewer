import type { Photo } from '@/types/photo'

function isPhoto(value: unknown): value is Photo {
  return (
    typeof value === 'object' &&
    value !== null &&
    'albumId' in value &&
    typeof value.albumId === 'number' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'url' in value &&
    typeof value.url === 'string' &&
    'thumbnailUrl' in value &&
    typeof value.thumbnailUrl === 'string'
  )
}

export function parsePhotos(value: unknown): Photo[] {
  if (!Array.isArray(value)) {
    throw new Error('Ожидался массив записей, пришло что-то другое.')
  }

  const items: unknown[] = value

  return items.map((item, index) => {
    if (!isPhoto(item)) {
      throw new Error(`Запись №${index + 1} не соответствует формату фотографии.`)
    }

    return item
  })
}
