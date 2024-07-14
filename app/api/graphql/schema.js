import { gql } from 'graphql-tag'

export const typeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Query {
    profile: Profile
    userSavedTracks(limit: Int, offset: Int): Tracks @cacheControl(maxAge: 60)
    topItems(TopArtistTopTrack: String): TopItem
    currentlyPlayingTrack: CurrentlyPlayingTrack
    artist(id: ID!): Artist
    genres: Genres @cacheControl(maxAge: 60)
    user: User
  }

  type User {
    id: ID!
    display_name: String
    loggedIn: Boolean
  }

  type TopItem {
    href: String
    limit: Int
    next: String
    offset: Int
    previous: String
    total: Int
    items: [TopArtistTopTrack]
  }

  union TopArtistTopTrack = Artist | Track

  type Profile {
    loggedIn: Boolean
    id: ID!
    href: String!
    display_name: String!
    email: String!
    images: [Image]
    followers: Followers
    type: String
    uri: String
  }

  type Image {
    url: String
    height: Int
    width: Int
  }

  type Followers {
    href: String
    total: Int!
  }

  type Tracks {
    href: String
    limit: Int
    next: String
    offset: Int
    previous: String
    total: Int!
    items: [Item]
  }

  type Item {
    added_at: String
    track: Track @cacheControl(maxAge: 30)
    # artists: Artist
    topItem: TopItem @cacheControl(maxAge: 30)
  }

  type Track {
    album: Album
    artists: [Artist]
    available_markets: [String]
    disc_number: Int
    duration_ms: Int
    explicit: Boolean
    # external_ids: ExternalId
    # external_urls: ExternalUrl
    href: String
    id: ID!
    is_playable: Boolean
    # linked_from: TrackLink
    # restrictions: TrackRestriction
    name: String
    popularity: Int
    preview_url: String
    track_number: Int
    type: String
    uri: String
    is_local: Boolean
  }

  type Album {
    album_type: String
    total_tracks: Int
    available_markets: [String]
    # externa_urls: ExternalUrl
    href: String
    id: ID!
    images: [Image]
    name: String
    release_date: String
    release_date_precision: String
    # restrictions: Restriction
    type: String
    uri: String
    artists: [Artist]
  }

  type Artist @cacheControl(maxAge: 3600) {
    external_urls: ExternalUrl
    followers: Followers
    genres: [String] @cacheControl(maxAge: 3600)
    href: String
    id: ID!
    images: [Image]
    name: String
    popularity: Int
    type: String
    uri: String
    # requesting more data for users top items
  }

  type ExternalUrl {
    spotify: String
  }

  # type ArtistPrecision {
  #   externa_urls: ExternalUrl
  #   followers: Followers
  #   genres: [String]
  #   href: String
  #   id: ID!
  #   images: [Image]
  #   name: String
  #   type: String
  #   uri: String
  # }

  type CurrentlyPlayingTrack {
    device: [Device]
    repeat_state: String
    shuffle_state: Boolean
    context: Context
    timestamp: Int
    progress_ms: Int
    is_playing: Boolean
    # item can be one of Track or Episode, however i dont have episode function
    # set up due to not beiing a podcast listener
    # todo: add episode type
    item: Track
    currently_playing_type: String
    actions: Actions
  }

  type Device {
    id: String
    is_active: Boolean
    is_private_session: Boolean
    is_restricted: Boolean
    name: String
    type: String
    volume_percent: Int
    supports_volume: Boolean
    currently_playing_track: String
  }

  type Context {
    type: String
    href: String
    external_urls: ExternalUrl
    uri: String
  }

  type Actions {
    interrupting_playback: Boolean
    pausing: Boolean
    resuming: Boolean
    seeking: Boolean
    skipping_next: Boolean
    skipping_prev: Boolean
    toggling_repeat_context: Boolean
    toggling_shuffle: Boolean
    togging_repeat_track: Boolean
    transferring_playback: Boolean
  }

  # custom type
  type Genres {
    tracks: Tracks
    genres: [String]
  }

  type Mutation {
    authenticateSpotify(code: String!): AuthResponse
  }

  type AuthResponse {
    success: Boolean!
    access_token: String!
    token_type: String
    expires_in: Int
    refresh_token: String
    scope: String
  }
`
