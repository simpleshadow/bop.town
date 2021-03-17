import { useState, useEffect, useRef, MutableRefObject } from 'react'

type UseMouseOptions = {
  onMouseEnter?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
}

type MouseEventHandler = (ev: MouseEvent) => any
export type MouseState = {
  x: number
  y: number
  isOver: boolean
}

const useMouse = ({ onMouseEnter, onMouseLeave }: UseMouseOptions = {}) => {
  const ref = useRef<HTMLDivElement>()
  const [mouseState, setMouseState] = useState({ x: null, y: null, isOver: false })
  const updateMousePosition = (e: MouseEvent) => {
    setMouseState({ x: e.clientX, y: e.clientY, isOver: true })
  }

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    ref.current?.addEventListener('mouseenter', e => {
      onMouseEnter && onMouseEnter(e)
      setMouseState({ x: null, y: null, isOver: true })
    })
    ref.current?.addEventListener('mouseleave', e => {
      onMouseLeave && onMouseLeave(e)
      setMouseState({ x: null, y: null, isOver: false })
    })

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      ref.current?.removeEventListener('mouseenter', onMouseEnter)
      ref.current?.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseEnter, onMouseLeave])

  return [ref, mouseState] as [MutableRefObject<HTMLDivElement>, MouseState]
}

export default useMouse
