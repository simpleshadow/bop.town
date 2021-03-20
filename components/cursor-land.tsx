import Debug from 'debug'
import { useEffect, useState } from 'react'
import { a, config, useSpring } from 'react-spring'
import { usePrevious, useCursorDataUrl } from '../hooks'
import { MouseState } from '../hooks/use-mouse'

type CursorLandProps = {
  color: string
  mouseState: MouseState
}

const debug = Debug('components:cursor-land')

const CursorLand = ({ color, mouseState }: CursorLandProps) => {
  const { x, y } = mouseState || {}
  const isMousePositionNull = x === null && y === null
  const [shouldAnimateMousePosition, setShouldAnimateMousePosition] = useState(isMousePositionNull)

  const prevMouseState = usePrevious<MouseState>(mouseState)
  const { x: prevX, y: prevY } = prevMouseState || {}

  const cursorDataUrl = useCursorDataUrl(color)
  const isPrevMousePositionNull = prevX === null && prevY === null

  let curLeft = x,
    curTop = y
  if (isPrevMousePositionNull && !isMousePositionNull) {
    const left = x
    const top = y
    const right = window.innerWidth - x
    const bottom = window.innerHeight - y
    if ((left <= top && left <= bottom) || (right <= top && right <= bottom)) {
      curLeft = x + 200 * (left <= right ? -1 : 1)
      curTop = y
    } else {
      curLeft = x
      curTop = y + 200 * (top <= bottom ? -1 : 1)
    }
    !shouldAnimateMousePosition && setShouldAnimateMousePosition(true)
  }

  const bounceInSpring = useSpring({
    config: config.wobbly,
    from: {
      scale: 1.5,
    },
    to: {
      scale: 1,
    },
    reset: isMousePositionNull,
  })

  const opacitySpring = useSpring({
    opacity: 1,
    from: {
      opacity: 0 as any,
    },
    reset: isMousePositionNull,
  })

  const positionSpring = useSpring({
    config: {
      friction: 25,
      mass: 1,
      tension: 320,
    },
    left: x,
    top: y,
    from: {
      left: curLeft,
      top: curTop,
    },
    onChange: ({ left, top }) => {
      const closeEnoughDistance = 1
      if (
        shouldAnimateMousePosition &&
        Math.abs(left - x) <= closeEnoughDistance &&
        Math.abs(top - y) <= closeEnoughDistance
      ) {
        setShouldAnimateMousePosition(false)
      }
    },
  })

  return (
    <div className="absolute h-full w-full bg-transparent pointer-events-none" style={{ cursor: 'none' }}>
      {cursorDataUrl && (
        <a.div
          style={{
            ...bounceInSpring,
            ...opacitySpring,
            ...(shouldAnimateMousePosition
              ? positionSpring
              : {
                  left: x,
                  top: y,
                }),
            position: 'fixed',
            height: 21,
            width: 15,
            background: `url(${cursorDataUrl}) no-repeat center`,
            filter: `drop-shadow(0px 5px 6px rgba(0, 0, 0, 0.3))` as any,
            overflow: 'hidden',
          }}
        />
      )}
    </div>
  )
}

export default CursorLand
