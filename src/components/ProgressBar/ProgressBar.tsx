import { useId } from 'react'

import type { LoadProgress } from '@/types/loader'

import { formatBytes } from './formatBytes'
import styles from './ProgressBar.module.css'

interface Readout {
  value: number | undefined
  max: number | undefined
  caption: string
}

function readProgress({ loaded, total }: LoadProgress): Readout {
  if (total === null) {
    return {
      value: undefined,
      max: undefined,
      caption: `Прочитано ${formatBytes(loaded)}`,
    }
  }

  const percent = Math.round((loaded / total) * 100)

  return {
    value: loaded,
    max: total,
    caption: `${percent}% — ${formatBytes(loaded)} из ${formatBytes(total)}`,
  }
}

interface ProgressBarProps {
  progress: LoadProgress
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const { value, max, caption } = readProgress(progress)
  const captionId = useId()

  return (
    <div className={styles.wrapper}>
      <progress
        aria-describedby={captionId}
        aria-label="Загрузка данных"
        className={styles.bar}
        max={max}
        value={value}
      />
      <p className={styles.caption} id={captionId}>
        {caption}
      </p>
    </div>
  )
}
