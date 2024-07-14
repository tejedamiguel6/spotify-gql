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

/*


curl --request GET \
  --url https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl \
  --header 'Authorization: Bearer BQCX0KantQXF5Hi2MHcbNM8RbJ88JpPaD-F929N92u3EI_ZmTWZn_71Kh6R2aRjFuBbUe_InWRDYAbiT_Fbz6UL9Lgx3Q1I3P-TIQhjkQggIvWUAgoJF5rW9G6-71_7KK11bVWWNSA8273-nd55ZkBbjRnE168a40BKmsxvTYRiOBqAaZ8oAPNpcmfIH'



*/
