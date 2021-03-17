export enum SocketEvents {
  SEND_STATUS = 'send-status',
  RECEIVED_PEER_STATUS = 'received-peer-status',
  PEER_CONNECTED = 'peer-connected',
  PEER_DISCONNECTED = 'peer-disconnected',
}

export type SocketEventDataPeerConnect = {
  id: string
}

export type SocketEventDataPeerDisconnect = {
  id: string
}

export type SocketEventDataUpadateActivePeers = {
  activePeers: string[]
}
