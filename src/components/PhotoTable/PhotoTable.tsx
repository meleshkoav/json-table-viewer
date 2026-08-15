import { useRef, type ReactNode } from 'react'
import { useTable } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Highlight } from '@/components/Highlight'
import { SEARCH_FIELD } from '@/hooks/useFilteredPhotos'
import type { Photo } from '@/types/photo'

import { columns, features, LINK_FIELDS } from './columns'
import styles from './PhotoTable.module.css'

const ROW_HEIGHT = 40
const OVERSCAN = 8
const HEADER_ROWS = 1

interface PhotoTableProps {
  photos: Photo[]
  query: string
}

export function PhotoTable({ photos, query }: PhotoTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const table = useTable({ features, columns, data: photos })
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan: OVERSCAN,
  })

  return (
    <div
      aria-label="Таблица фотографий"
      className={styles.scroll}
      ref={scrollRef}
      role="region"
      tabIndex={0}
    >
      <table aria-rowcount={rows.length + HEADER_ROWS} className={styles.table} role="table">
        <thead className={styles.head} role="rowgroup">
          {table.getHeaderGroups().map((group) => (
            <tr
              aria-rowindex={HEADER_ROWS}
              className={styles.row}
              key={group.id}
              role="row"
              style={{ height: ROW_HEIGHT }}
            >
              {group.headers.map((header) => (
                <th className={styles.cell} key={header.id} role="columnheader" scope="col">
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className={styles.body}
          role="rowgroup"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index]

            if (!row) {
              return null
            }

            return (
              <tr
                aria-rowindex={item.index + HEADER_ROWS + 1}
                className={styles.row}
                key={row.id}
                role="row"
                style={{ height: ROW_HEIGHT, transform: `translateY(${item.start}px)` }}
              >
                {row.getAllCells().map((cell) => {
                  const value = cell.getValue()
                  const text = typeof value === 'string' ? value : undefined
                  let content: ReactNode

                  if (cell.column.id === SEARCH_FIELD) {
                    content = <Highlight query={query} text={row.original[SEARCH_FIELD]} />
                  } else if (text !== undefined && LINK_FIELDS.has(cell.column.id)) {
                    content = (
                      <a className={styles.link} href={text} rel="noreferrer" target="_blank">
                        {text}
                      </a>
                    )
                  } else {
                    content = <table.FlexRender cell={cell} />
                  }

                  return (
                    <td className={styles.cell} key={cell.id} role="cell" title={text}>
                      {content}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
