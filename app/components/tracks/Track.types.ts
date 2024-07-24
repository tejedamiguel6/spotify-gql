export type ItemType = 'likedTracks' | 'topTracks' | 'tracks'

export type TrackProps = {
  setSelectedAlbum: (track: any) => void
  setTopTrackNote: (track: any) => void
}

export type track = {
  added_at: string
  track: {
    id: string
    preview_url: string
    artists: {
      id: string
      name: string
      genres: string[]
    }[]
    name: string
    duration_ms: number
    album: {
      id: string
      total_tracks: number
      release_date: string
      release_date_precision: string
      name: string
      images: {
        url: string
        width: number
        height: number
      }[]
    }
    is_local: boolean
  }

  is_local: boolean
}

export type trackData = {
  added_at: string
  track: {
    album: {
      id: string
      images: {
        url: string
        width: number
        height: number
      }[]
      name: string
      release_date: string
      release_date_precision: string
      total_tracks: number
      __typename: string
    }
    artists: [
      {
        __typename: string
        id: string
        name: string
        genres: string[]
      }
    ]
    duration_ms: number
    id: string
    is_local: boolean
    name: string
    preview_url: string
    __typename: string
  }
}

export type trackImageData = {
  album: {
    id: string
    images: {
      url: string
      width: number
      height: number
    }[]
  }
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  __typename: string
}
