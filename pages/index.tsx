import Debug from 'debug'
import { useEffect, useState } from 'react'

import Cursor from '../components/cursor'
import CursorLand from '../components/cursor-land'
import { useMouse, useSpotifyPlayer, useTransporter } from '../hooks'
import { TransporterPeerStatusData } from '../hooks/use-transporter'
import SpotifyConnectButton from '../components/spotify-connect-button'

const debug = Debug(`pages:index`)

const Index = () => {
  const [peerCursors, setPeerCursors] = useState<{ [id: string]: TransporterPeerStatusData }>({})
  const transporter = useTransporter({
    onPeerConnected: id => setPeerCursors(cursors => ({ ...cursors, [id]: null })),
    onReceivedPeerStatus: (id, status) =>
      setPeerCursors(cursors => {
        if (cursors[id]) cursors[id] = status
        return { ...cursors, [id]: { ...cursors[id] } }
      }),
    onPeerDisconnected: id =>
      setPeerCursors(cursors => {
        let newCursors = cursors
        delete newCursors[id]
        return newCursors
      }),
  })
  const [mouseRef, mouseState] = useMouse()
  const [color] = useState(colors[Math.floor(Math.random() * 5)])
  const spotifyPlayer = useSpotifyPlayer()

  useEffect(() => {
    transporter?.sendStatus({ position: { x: mouseState.x, y: mouseState.y }, color })
  }, [mouseState])

  return (
    <div
      className="absolute inset-0 text-white overflow-hidden"
      onClick={() => spotifyPlayer && spotifyPlayer.getCurrentState().then(state => debug('%o', state))}
      style={{
        background: '#181A20',
        cursor: 'none',
      }}
      ref={mouseRef}
    >
      {typeof localStorage !== 'undefined' && !localStorage.spotifyToken && (
        <div className="absolute flex items-center justify-center h-full w-full">
          <SpotifyConnectButton />
        </div>
      )}
      {peerCursors &&
        Object.entries(peerCursors).map(([id]) => (
          <Cursor key={id} position={peerCursors[id]?.position} color={peerCursors[id]?.color} />
        ))}
      {mouseState.isOver && <CursorLand color={color} mouseState={mouseState} />}
    </div>
  )
}

const colors = [
  '#FBB506', // yellow
  '#FF2F55', // magenta
  '#4743FF', // blue
  '#963298', // purple
  '#0ACF83', // green
]

export default Index
