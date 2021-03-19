import { a, useSpring, config } from 'react-spring'
import { useState } from 'react'

const SpotifyConnectButton = () => {
  const [isHovering, setIsHovering] = useState(false)
  const hoverSpring = useSpring({
    config: config.stiff,
    scale: isHovering ? 1.15 : 1,
  })
  return (
    <a.div
      className="relative text-white uppercase text-xs font-medium px-8 py-4 rounded-full select-none"
      style={{
        ...hoverSpring,
        background: '#1DB954',
        filter: `drop-shadow(0px 5px 6px rgba(0, 0, 0, 0.3))` as any,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      onClick={() => {
        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
        const scopes = ['streaming', 'user-modify-playback-state', 'user-read-email', 'user-read-private']
        const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
        const spotifyAuthUri = 'https://accounts.spotify.com/en/authorize'
        window.location.href = `${spotifyAuthUri}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          '%20'
        )}&response_type=token&show_dialog=true`
      }}
    >
      Connect Spotify
    </a.div>
  )
}

export default SpotifyConnectButton
