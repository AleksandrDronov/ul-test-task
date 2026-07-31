import { useEffect, useRef, useState } from 'react'

/**
 * Local, immediately-responsive input state that commits to `onCommit` only
 * after `delayMs` of inactivity (resolution #2: debounce text/price filter
 * inputs so typing doesn't fire a request per keystroke). When the external
 * value changes for a reason other than our own debounced commit (e.g. a
 * "reset filters" action), local state re-syncs to it.
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
    setSyncedExternalValue(externalValue)
    setValue(externalValue)
  }

  const handleChange = (next: Value): void => {
    setValue(next)
    setSyncedExternalValue(next)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      onCommitRef.current(next)
    }, delayMs)
  }

  return [value, handleChange]
}
