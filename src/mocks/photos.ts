import type { Photo } from '@/types/photo'

const WORDS: readonly string[] = [
  'accusamus',
  'beatae',
  'ad',
  'facilis',
  'cum',
  'similique',
  'qui',
  'sunt',
  'reprehenderit',
  'est',
  'deserunt',
  'velit',
  'ipsam',
  'officia',
  'porro',
  'nemo',
  'quia',
  'dolorem',
  'magni',
  'voluptas',
  'incidunt',
  'labore',
  'aliquam',
  'quaerat',
]

const COLORS: readonly string[] = [
  '92c952',
  '771796',
  '24f355',
  'd32776',
  'f66b97',
  '56a8c2',
  'b0f7cc',
  '54176f',
  '51aa97',
  '810b14',
]

const PHOTOS_PER_ALBUM = 50
const MIN_TITLE_WORDS = 4
const TITLE_WORDS_SPREAD = 6

function wordAt(seed: number): string {
  return WORDS[seed % WORDS.length] ?? ''
}

function colorAt(seed: number): string {
  return COLORS[seed % COLORS.length] ?? ''
}

function buildTitle(index: number): string {
  const length = MIN_TITLE_WORDS + (index % TITLE_WORDS_SPREAD)
  const words: string[] = []

  for (let position = 0; position < length; position += 1) {
    words.push(wordAt(index * 7 + position * 13))
  }

  return words.join(' ')
}

export function generatePhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, index) => {
    const color = colorAt(index)

    return {
      albumId: Math.floor(index / PHOTOS_PER_ALBUM) + 1,
      id: index + 1,
      title: buildTitle(index),
      url: `https://via.placeholder.com/600/${color}`,
      thumbnailUrl: `https://via.placeholder.com/150/${color}`,
    }
  })
}
