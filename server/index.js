const http = require('http')
const { resolve } = require('path')

const { validateEnv } = require('valid-env')
const dotenv = require('dotenv')
const debug = require('debug')('catalyst:index')

const { connectToRedis, makeExiter, makeRenderer } = require('./utils')
const { makeServer } = require('./server')

// Load config from server.env and ensure the correct values are set
// Will exit(1) if required variables are undefined
dotenv.config({ path: resolve(__dirname, '../.env.server.local') })

validateEnv(['REDIS_URL', 'PUBLIC_URL', 'API_URL'])

//
// Server entrypoint
//
;(async () => {
  debug(`start redisUrl=${process.env.REDIS_URL}`)

  try {
    const redisClient = await connectToRedis(process.env.REDIS_URL)
    const renderer = makeRenderer()

    const app = makeServer(redisClient, renderer)
    let httpServer = http.createServer(app)

    // Attach our express server to port 8080
    await new Promise(resolve => app.listen(8080, resolve))
    console.log('Listening on :8080')

    // Listen for signals and exit cleanly
    const exit = makeExiter(redisClient, httpServer)
    process.on('SIGINT', exit)
    process.on('SIGTERM', exit)
  } catch (error) {
    console.log('Failed to startup', error.message)
    process.exit(1)
  }
})()
