import { RESTDataSource } from '@apollo/datasource-rest'

export class SpotifyAPI extends RESTDataSource {
  constructor(options: { token: string; cache: any }) {
    super()
    this.baseURL = 'https://api.spotify.com/v1/'
    this.token = options.token
    this.cache = options.cache
  }

  willSendRequest(_path, request) {
    request.headers['authorization'] = this.token ? `Bearer ${this.token}` : ''
    console.log('request', request.headers)
  }

  async getUserProfile() {
    return this.get('me')
  }

  async getArtist(id: string) {
    return this.get(`artists/${id}`)
  }

  async getUserSavedTracks(limit = 1, offset = 0) {
    return this.get(`me/tracks?limit=${limit}&offset=${offset}`)
  }

  async getUserTopArtists(limit = 12) {
    return this.get(`me/top/artists?limit=${limit}`)
  }

  async getUserTopTrack(limit = 12) {
    return this.get(`me/top/tracks?limit=${limit}`)
  }

  async getCurrentlyPlayingTrack() {
    return this.get('me/player/currently-playing')
  }
  async getCurrentDevice() {
    return this.get(`me/player/devices`)
  }
}
