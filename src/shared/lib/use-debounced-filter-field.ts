import { useCallback, useEffect, useRef, useState } from 'react'

export type DebouncedFilterFieldResult<Value> = {
  value: Value
  onChange: (next: Value) => void
  flush: () => void
}

/**
 * Локальное состояние поля фильтра с отложенным применением (debounce).
 *
 * Поле мгновенно отражает ввод пользователя, а `onCommit` вызывается
 * только после паузы в `delayMs` мс. Внешнее значение (`externalValue`)
 * синхронизируется обратно в локальное состояние — например, при сбросе
 * фильтров или навигации по URL — но не перезаписывает ввод, если
 * ожидается собственный отложенный коммит.
 *
 * `flush` немедленно применяет текущее локальное значение (blur, Enter).
 *
 * @template Value — тип значения поля.
 * @param externalValue — актуальное значение из внешнего источника (URL, store).
 * @param onCommit — колбэк, вызываемый после debounce с финальным значением.
 * @param delayMs — задержка перед коммитом в миллисекундах. По умолчанию 400.
 */
export const useDebouncedFilterField = <Value>(
  externalValue: Value,
  onCommit: (value: Value) => void,
  delayMs = 400,
): DebouncedFilterFieldResult<Value> => {
  const [value, setValue] = useState(externalValue)
  const [syncedExternalValue, setSyncedExternalValue] = useState(externalValue)
  const [lastCommitted, setLastCommitted] = useState(externalValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCommitRef = useRef(onCommit)
  const valueRef = useRef(value)
  const lastCommittedRef = useRef(lastCommitted)

  useEffect(() => {
    onCommitRef.current = onCommit
  }, [onCommit])

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    lastCommittedRef.current = lastCommitted
  }, [lastCommitted])

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  if (externalValue !== syncedExternalValue) {
    const isOwnStaleCommit = externalValue === lastCommitted && value !== lastCommitted

    if (!isOwnStaleCommit) {
      setValue(externalValue)
      setLastCommitted(externalValue)
    }

    setSyncedExternalValue(externalValue)
  }

  const commit = useCallback((next: Value): void => {
    lastCommittedRef.current = next
    setLastCommitted(next)
    onCommitRef.current(next)
  }, [])

  const flush = useCallback((): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const current = valueRef.current

    if (current !== lastCommittedRef.current) {
      commit(current)
    }
  }, [commit])

  const onChange = useCallback(
    (next: Value): void => {
      setValue(next)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        commit(next)
      }, delayMs)
    },
    [commit, delayMs],
  )

  return { value, onChange, flush }
}
