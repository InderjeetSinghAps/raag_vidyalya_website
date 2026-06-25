export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null

  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      return u.pathname.split('/').filter(Boolean)[0] || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/').pop() || null
      }
      return u.searchParams.get('v') || null
    }
  } catch {
    /* not a valid URL */
  }

  return null
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export function getGoogleDriveDirectUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)/)
  const id = match?.[1]
  if (!id) return url
  return `/api/image/${id}`
}

export function getGoogleDriveAudioUrl(url: string): string {
  const idMatch =
    url.match(/\/file\/d\/([^/]+)/) ||
    url.match(/\/open\?id=([^&]+)/) ||
    url.match(/\/uc\?id=([^&]+)/)
  const id = idMatch?.[1]
  if (!id) return url
  return `/api/audio/${id}`
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed${u.pathname}?modestbranding=1&rel=0`
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/') || u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/').pop()
        if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`
      }
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`
    }
  } catch {
    /* not a valid URL */
  }

  return null
}
