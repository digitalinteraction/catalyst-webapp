// Todo: merge this & the client files back together again

export function makeApiClient() {
  return new ApiClient()
}

// Not used in favour of using vuex modules with an "initialState"
// Which is pre-fetched from redis

class ApiClient {}
