import { useId } from 'react'

import styles from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const inputId = useId()

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        Поиск по названию
      </label>
      <input
        className={styles.input}
        id={inputId}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Введите текст"
        type="search"
        value={value}
      />
    </div>
  )
}
