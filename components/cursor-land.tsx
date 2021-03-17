import { useEffect } from 'react'
import useCursorDataUrl from '../hooks/use-cursor-data-url'
import useMouse, { MouseState } from '../hooks/use-mouse'

type CursorLandProps = {
  onMouseUpdate: (state: MouseState) => any
}

const CursorLand = ({ onMouseUpdate }: CursorLandProps) => {
  const cursorDataUrl = useCursorDataUrl()
  const [mouseRef, mouseState] = useMouse()

  useEffect(() => {
    onMouseUpdate && onMouseUpdate(mouseState)
  }, [mouseState])

  return (
    <div
      className="h-full w-full"
      style={{ cursor: 'none', filter: `drop-shadow(0px 5px 6px rgba(0, 0, 0, 0.3))` }}
      ref={mouseRef}
    >
      {cursorDataUrl && mouseState.isOver && (
        <div
          style={{
            position: 'fixed',
            height: 21,
            width: 15,
            left: mouseState.x,
            top: mouseState.y,
            background: `url(${cursorDataUrl}) no-repeat center`,
            overflow: 'hidden',
          }}
        />
      )}
    </div>
  )
}

export default CursorLand
