import Debug from 'debug'
import { useEffect, useRef, useState } from 'react'
import { a, useSpring, config } from 'react-spring'
import { useCursorDataUrl, usePrevious } from '../hooks'

type CursorProps = {
  position?: {
    x: number
    y: number
  }
}

const debug = Debug(`components:cursor`)

const Cursor = ({ position }: CursorProps) => {
  const { x: left, y: top } = position || {}

  const prevPosition = usePrevious<CursorProps['position']>(position)
  const cursorDataUrl = useCursorDataUrl()

  const isPositionNull = left == null && top == null
  const isPrevPositionNull = prevPosition?.x === null && prevPosition?.y === null

  const prevNotNullPosition = useRef<CursorProps['position']>(position)

  useEffect(() => {
    if (position && !isPositionNull) prevNotNullPosition.current = position
  }, [position])

  const introSpring = useSpring({
    config: config.wobbly,
    scale: !isPositionNull ? 1 : 0.75,
    from:
      !isPrevPositionNull && !isPositionNull
        ? {
            scale: 2,
          }
        : null,
    reset: isPrevPositionNull,
  })
  const positionSpring = useSpring({
    ...(!isPositionNull
      ? { left, top }
      : { left: prevNotNullPosition.current.x, top: prevNotNullPosition.current.y }),
    opacity: isPositionNull ? 0 : 1,
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
