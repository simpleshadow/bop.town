import Debug from 'debug'
import { useEffect, useRef, useState } from 'react'
import { a, useSpring, config } from 'react-spring'
import { useCursorDataUrl, usePrevious } from '../hooks'

type CursorProps = {
  color?: string
  position?: {
    x: number
    y: number
  }
}

const debug = Debug(`components:cursor`)

const Cursor = ({ color, position }: CursorProps) => {
  const { x, y } = position || {}

  const prevPosition = usePrevious<CursorProps['position']>(position)
  const cursorDataUrl = useCursorDataUrl(color)

  const isPositionNull = x == null && y == null
  const isPrevPositionNull = prevPosition?.x === null && prevPosition?.y === null

  const prevNotNullPosition = useRef<CursorProps['position']>(position)

  useEffect(() => {
    if (position && !isPositionNull) prevNotNullPosition.current = position
  }, [position])

  let left = x,
    top = y
  if (isPositionNull) {
    const lastLeft = prevNotNullPosition.current?.x
    const lastTop = prevNotNullPosition.current?.y
    const lastRight = window.innerWidth - prevNotNullPosition.current?.x
    const lastBottom = window.innerHeight - prevNotNullPosition.current?.y

    if (
      (lastLeft <= lastTop && lastLeft <= lastBottom) ||
      (lastRight <= lastTop && lastRight <= lastBottom)
    ) {
      left = prevNotNullPosition.current?.x + 200 * (lastLeft <= lastRight ? -1 : 1)
      top = prevNotNullPosition.current?.y
    } else {
      left = prevNotNullPosition.current?.x
      top = prevNotNullPosition.current?.y + 200 * (lastTop <= lastBottom ? -1 : 1)
    }
  }

  const introSpring = useSpring({
    config: config.wobbly,
    scale: !isPositionNull ? 1 : 1.25,
    from:
      !isPrevPositionNull && !isPositionNull
        ? {
            scale: 2,
          }
        : null,
    reset: isPrevPositionNull,
  })
  const positionSpring = useSpring({
    ...{ left, top },
    opacity: isPositionNull ? 0 : (1 as any),
    from:
      !isPrevPositionNull && !isPositionNull
        ? {
            left,
            top,
            opacity: 0,
          }
        : null,
    reset: isPrevPositionNull,
  })
  return (
    <>
      <div
        style={{
          filter: `drop-shadow(0px 5px 6px rgba(0, 0, 0, 0.3))`,
        }}
      >
        <a.div
          style={{
            ...positionSpring,
            ...introSpring,
            position: 'fixed',
            height: 21,
            width: 15,
            background: `url(${cursorDataUrl}) no-repeat center`,
            overflow: 'hidden',
          }}
        />
      </div>
    </>
  )
}

export default Cursor
