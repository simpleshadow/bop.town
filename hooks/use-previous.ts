import { useEffect, useRef } from 'react'

const usePrevious = <T = any>(value: T) => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default usePrevious
