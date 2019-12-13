const redis = require('redis')

/** Creates a request for a key in redis and json decodes the value */
function redisGetJson(redis, key) {
  return new Promise(resolve => {
    redis.get(key, (error, data) => {
      try {
        if (error) throw error
        resolve(JSON.parse(data))
      } catch (error) {
        console.log(error)
        resolve(undefined)
      }
    })
  })
}

export function makeApiClient() {
  return new ApiClient()
}

// Not used in favour of using vuex modules with an "initialState"
// Which is pre-fetched from redis

class ApiClient {
  constructor() {
    this.redis = redis.createClient(process.env.REDIS_URL)
  }

  projects() {
    return redisGetJson(this.redis, 'cards')
  }
  labels() {
    return redisGetJson(this.redis, 'labels')
  }
  content() {
    return redisGetJson(this.redis, 'content')
  }
}
