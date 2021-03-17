import { useEffect, useRef } from 'react'

const useCursorDataUrl = () => {
  const cursorDataUrl = useRef<string>()

  useEffect(() => {
    cursorDataUrl.current = getCursorDataUrl()
  }, [])

  return cursorDataUrl.current
}
const getCursorDataUrl = () => {
  const colors = [
    '#FBB506', // yellow
    '#FF2F55', // magenta
    '#4743FF', // blue
    '#963298', // purple
    '#0ACF83', // green
  ]

  const cursor = document.createElement('canvas')
  const ctx = cursor.getContext('2d')

  cursor.width = 15
  cursor.height = 21

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, 21)
  ctx.lineTo(6, 15)
  ctx.lineTo(15, 15)
  ctx.closePath()
  ctx.fillStyle = colors[Math.floor(Math.random() * 5)]
  ctx.fill()

  return cursor.toDataURL()
}

export default useCursorDataUrl
