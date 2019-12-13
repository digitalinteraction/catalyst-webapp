import ky from 'ky'

export function makeApiClient(url) {
  return new ApiClient(url)
}

class ApiClient {
  constructor(url) {
    this.client = ky.extend({ prefixUrl: url })
  }

  projects() {
    return this.client.get('cards').json()
  }
  labels() {
    return this.client.get('labels').json()
  }
  content() {
    return this.client.get('content').json()
  }
}
