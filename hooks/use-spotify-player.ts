import { useEffect, useState } from 'react'
import Debug from 'debug'
import { LocalStorage } from '../types'

const debug = Debug('hooks:use-spotify-player')

const useSpotifyPlayer = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Spotify.SpotifyPlayer>()

  const initPlayer = () => {
    const spotifyToken = typeof localStorage !== 'undefined' && localStorage[LocalStorage.SPOTIFY_TOKEN]

    if (!currentPlayer && spotifyToken && typeof window.Spotify !== 'undefined') {
      const player = new window.Spotify.Player({
        name: 'bop.town',
        getOAuthToken: cb => cb(spotifyToken),
      })

      player.addListener('initialization_error', ({ message }) => debug(message))
      player.addListener('authentication_error', ({ message }) => debug(message))
      player.addListener('account_error', ({ message }) => debug(message))
      player.addListener('playback_error', ({ message }) => debug(message))

      player.addListener('player_state_changed', state => debug(state))
      player.addListener('ready', ({ device_id }) => debug('Ready with Device ID %o', device_id))
      player.addListener('not_ready', ({ device_id }) => debug('Device ID has gone offline %o', device_id))

      player.connect()

      setCurrentPlayer(player)
    }
  }

  useEffect(() => {
    const onMount = async () => {
      if (typeof window !== 'undefined') {
        if (!window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady = initPlayer
        } else {
          initPlayer()
        }
        try {
          await loadSpotifyPlayer()
        } catch (error) {
          debug(error)
        }
      }
    }
    onMount()
  }, [currentPlayer])

  useEffect(() => {
    const hash = window.location.hash
      .replace('#', '')
      .split('&')
      .reduce<{ [id: string]: any }>((prev, item) => {
        return Object.assign({ [item.split('=')[0]]: item.split('=')[1] }, prev)
      }, {})
    const spotifyToken = localStorage.getItem(LocalStorage.SPOTIFY_TOKEN)
    window.location.hash &&
      !spotifyToken &&
      spotifyToken !== hash?.access_token &&
      localStorage.setItem(LocalStorage.SPOTIFY_TOKEN, hash.access_token)
    history.replaceState(null, null, ' ')
  }, [])

  return currentPlayer
}

const loadSpotifyPlayer = (): Promise<any> => {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById('spotify-player')

    if (!scriptTag) {
      const script = document.createElement('script')

      script.id = 'spotify-player'
      script.type = 'text/javascript'
      script.async = false
      script.defer = true
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.onload = () => resolve()
      script.onerror = (error: any) => reject(new Error(`loadScript: ${error.message}`))

      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
}

export default useSpotifyPlayer
