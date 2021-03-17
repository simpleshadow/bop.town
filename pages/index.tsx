import Debug from 'debug'
import { useState } from 'react'
import Cursor from '../components/cursor'
import CursorLand from '../components/cursor-land'
import useTransporter from '../hooks/use-transporter'

const debug = Debug(`pages:index`)

const IndexPage = () => {
  const [cursors, setCursors] = useState<{ [id: string]: { position?: { x: number; y: number } } }>({})
  const transporter = useTransporter({
    onPeerConnected: id => setCursors(cursors => ({ ...cursors, [id]: {} })),
    onReceivedPeerStatus: (id, { position }) =>
      setCursors(cursors => {
        if (cursors[id]) cursors[id].position = position
        return { ...cursors, [id]: { ...cursors[id] } }
      }),
    onPeerDisconnected: id =>
      setCursors(cursors => {
        let newCursors = cursors
        delete newCursors[id]
        return newCursors
      }),
  })

  return (
    <div
      className="h-screen w-screen text-white overflow-hidden"
      style={{
        background: '#181A20',
      }}
    >
      {cursors && Object.entries(cursors).map(([id]) => <Cursor key={id} position={cursors[id].position} />)}
      <CursorLand onMouseUpdate={({ x, y }) => transporter?.sendStatus({ position: { x, y } })} />
    </div>
  )
}

const SpotifyConnectButton = () => {}

export default IndexPage
