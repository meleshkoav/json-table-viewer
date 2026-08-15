import { Fragment } from 'react'

import styles from './Highlight.module.css'

interface Segment {
  text: string
  isMatch: boolean
}

function splitByMatches(text: string, query: string): Segment[] {
  if (query === '') {
    return [{ text, isMatch: false }]
  }

  const haystack = text.toLowerCase()
  const needle = query.toLowerCase()
  const segments: Segment[] = []
  let cursor = 0
  let found = haystack.indexOf(needle)

  while (found !== -1) {
    if (found > cursor) {
      segments.push({ text: text.slice(cursor, found), isMatch: false })
    }

    segments.push({ text: text.slice(found, found + needle.length), isMatch: true })
    cursor = found + needle.length
    found = haystack.indexOf(needle, cursor)
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false })
  }

  return segments
}

interface HighlightProps {
  text: string
  query: string
}

export function Highlight({ text, query }: HighlightProps) {
  return splitByMatches(text, query).map((segment, index) =>
    segment.isMatch ? (
      <mark className={styles.mark} key={index}>
        {segment.text}
      </mark>
    ) : (
      <Fragment key={index}>{segment.text}</Fragment>
    ),
  )
}
