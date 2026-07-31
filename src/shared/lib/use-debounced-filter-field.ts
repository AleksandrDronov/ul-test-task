import { useEffect, useRef, useState } from 'react'

/**
 * Локальное, мгновенно обновляемое состояние поля, которое передаёт значение в `onCommit`
 * только после `delayMs` бездействия (разрешение #2: debounce для текстовых/ценовых полей,
 * чтобы не отправлять запрос на каждый символ). Когда внешнее значение меняется по другой
 * причине (например, «сбросить фильтры»), локальное состояние синхронизируется с ним.
 * Просроченные коммиты, пришедшие когда пользователь уже ввёл новое значение, не должны
 * перезаписывать локальный ввод.
 */
export const useDebouncedFilterField = <Value>(
  externalValue: Value,
  onCommit: (value: Value) => void,
  delayMs = 400,
): [Value, (next: Value) => void] => {
  const [value, setValue] = useState(externalValue)
  // Mirrors the React-recommended "adjusting state when a prop changes"
  // pattern instead of a setState-in-effect, so an external reset (e.g. the
  // "reset filters" action) is reflected in the same render, not one tick late.
  const [syncedExternalValue, setSyncedExternalValue] = useState(externalValue)
  const [lastCommitted, setLastCommitted] = useState(externalValue)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCommitRef = useRef(onCommit)

  useEffect(() => {
    onCommitRef.current = onCommit
  }, [onCommit])

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

  const handleChange = (next: Value): void => {
    setValue(next)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setLastCommitted(next)
      onCommitRef.current(next)
    }, delayMs)
  }

  return [value, handleChange]
}
