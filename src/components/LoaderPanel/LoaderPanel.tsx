import { ProgressBar } from '@/components/ProgressBar'
import type { LoaderState } from '@/types/loader'

import styles from './LoaderPanel.module.css'

interface LoaderPanelProps {
  state: LoaderState<readonly unknown[]>
  onStart: () => void
  onCancel: () => void
}

export function LoaderPanel({ state, onStart, onCancel }: LoaderPanelProps) {
  switch (state.status) {
    case 'idle':
      return (
        <section className={styles.panel}>
          <p className={styles.message} role="status">
            Данные ещё не загружены.
          </p>
          <button className={styles.primary} onClick={onStart} type="button">
            Загрузить
          </button>
        </section>
      )

    case 'loading':
      return (
        <section className={styles.panel}>
          <ProgressBar progress={state.progress} />
          <button className={styles.secondary} onClick={onCancel} type="button">
            Отмена
          </button>
        </section>
      )

    case 'success':
      return (
        <section className={styles.summary}>
          <p className={styles.message} role="status">
            Загружено записей: {state.data.length.toLocaleString('ru-RU')}
          </p>
          <button className={styles.secondary} onClick={onStart} type="button">
            Загрузить заново
          </button>
        </section>
      )

    case 'cancelled':
      return (
        <section className={styles.panel}>
          <p className={styles.message} role="status">
            Загрузка отменена.
          </p>
          <button className={styles.primary} onClick={onStart} type="button">
            Загрузить снова
          </button>
        </section>
      )

    case 'error':
      return (
        <section className={`${styles.panel} ${styles.failed}`} role="alert">
          <p className={styles.message}>Не удалось загрузить данные</p>
          <p className={styles.reason}>{state.message}</p>
          <button className={styles.primary} onClick={onStart} type="button">
            Повторить
          </button>
        </section>
      )
  }
}
