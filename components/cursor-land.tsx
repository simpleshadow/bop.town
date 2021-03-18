import { useEffect } from 'react'
import useCursorDataUrl from '../hooks/use-cursor-data-url'
import useMouse, { MouseState } from '../hooks/use-mouse'

type CursorLandProps = {
  color: string
  mouseState: MouseState
}

const CursorLand = ({ color, mouseState }: CursorLandProps) => {
  const cursorDataUrl = useCursorDataUrl(color)

  return (
    <div className="absolute h-full w-full bg-transparent pointer-events-none" style={{ cursor: 'none' }}>
      {cursorDataUrl && (
        <div
          style={{
            position: 'fixed',
            height: 21,
            width: 15,
            left: mouseState.x,
            top: mouseState.y,
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
