import { Socket, io } from 'socket.io-client'
import Debug from 'debug'

import { useEffect, useState } from 'react'
import {
  SocketEvents,
  SocketEventDataPeerConnect,
  SocketEventDataPeerDisconnect,
  SocketEventDataUpadateActivePeers,
} from '../types/socket-events'

export type TransporterPeerStatusData = {
  color?: string
  name?: string
  position: {
    x: number
    y: number
  }
}

const debug = Debug(`hooks:use-transporter`)

type Transporter = {
  peers: Peer[]
  socket: Socket
  status?: TransporterPeerStatusData
  sendStatus: (data: TransporterPeerStatusData) => any
}

type Peer = {
  id: string
  status?: TransporterPeerStatusData
}

type TransporterOptions = {
  onPeerConnected: (id: string) => any
  onPeerDisconnected: (id: string) => any
  onReceivedPeerStatus: (id: string, data: TransporterPeerStatusData) => any
}

const useTransporter = (options: TransporterOptions) => {
  const [transporter, setTransporter] = useState<Transporter>()

  useEffect(() => {
    if (!transporter) setTransporter(createTransporter(options))
  }, [])

  return transporter
}

const createTransporter = ({
  onPeerConnected,
  onPeerDisconnected,
  onReceivedPeerStatus,
}: TransporterOptions) => {
  let transporter: Transporter
  if (typeof window !== undefined) {
    transporter = {
      peers: [],
      socket: io(`${process.env.NEXT_PUBLIC_SOCKET_IO_HOST}`),
      sendStatus: status => {
        const { position } = status
        transporter.socket.emit(SocketEvents.SEND_STATUS, {
          position,
        })
      },
    }

    const addPeer = (id: string) => {
      if (getPeerIndex(id) < 0) {
        transporter.peers.push({ id })
        debug(`addPeer ${id} %O`, transporter)
      }
    }

    const getPeerIndex = (id: string) => transporter.peers.findIndex(peer => peer.id === id)

    const getPeer = (id: string) => {
      const index = getPeerIndex(id)
      return index >= 0 ? transporter.peers[index] : undefined
    }
    const removePeer = (peerId: string) => {
      transporter.peers = transporter.peers.filter(peer => peer.id !== peerId)
    }

    // socket.io
    transporter.socket.on('connect', () => {
      // peer connected
      transporter.socket.on(SocketEvents.PEER_CONNECTED, (data: SocketEventDataPeerConnect) => {
        debug(`${SocketEvents.PEER_CONNECTED} %O`, data)
        if (data && getPeerIndex(data.id) < 0) {
          addPeer(data.id)
          if (data.id !== transporter.socket.id) {
            debug(`onPeerConnected ${data.id}`)
            onPeerConnected && onPeerConnected(data.id)
          }
        }
      })

      // peer disconnected
      transporter.socket.on(SocketEvents.PEER_DISCONNECTED, (data: SocketEventDataPeerDisconnect) => {
        if (data && data.id !== transporter.socket.id) {
          removePeer(data.id)
          debug(`onPeerDisconnected ${data.id}`)
          onPeerDisconnected && onPeerDisconnected(data.id)
        }
      })

      // update peer statuses
      transporter.socket.on(
        SocketEvents.RECEIVED_PEER_STATUS,
        ({ id, position }: TransporterPeerStatusData & { id: string }) => {
          const index = getPeerIndex(id)
          const activePeer = getPeer(id)
          if (index >= 0 && activePeer) {
            transporter.peers[index] = {
              ...transporter.peers[index],
              id,
              status: { position },
            }
            debug(
              `${SocketEvents.RECEIVED_PEER_STATUS} ${id} %O %O`,
              transporter.peers[index],
              transporter.peers
            )
          }
          onReceivedPeerStatus && onReceivedPeerStatus(id, { position })
        }
      )
    })
  }

  return transporter
}

export default useTransporter
