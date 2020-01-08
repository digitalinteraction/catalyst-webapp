const { resolve } = require('path')
const { readFileSync } = require('fs')

const stoppable = require('stoppable')
const redis = require('redis')
const { createBundleRenderer } = require('vue-server-renderer')

const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

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

/** Generate opengraph metadata */
function generateMeta(url, publicUrl, title, twitterHandle, customMeta = []) {
  let tags = []

  // const baseUrl = process.env.PUBLIC_URL
  // const twitterHandle = process.env.TWITTER_HANDLE || ''

  const meta = [
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: publicUrl + '/public/opengraph.png' },
    { property: 'og:url', content: publicUrl + url },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: twitterHandle }
  ].concat(customMeta)

  for (let attrs of meta) {
    let tag = ['<meta']
    for (let attrName in attrs) {
      tag.push(`${attrName}="${attrs[attrName]}"`)
    }
    tags.push(tag.join(' ') + '>')
  }

  return tags.join('')
}

function makeExiter(redisClient, httpServer) {
  return async () => {
    console.log('\n Exiting cleanly')

    if (redisClient) {
      console.log('Closing redis client')
      redisClient.quit()
    }

    if (httpServer) {
      console.log('Stopping server')
      await new Promise(resolve => stoppable(httpServer).stop(resolve))
    }

    process.exit()
  }
}

function connectToRedis(url) {
  const client = redis.createClient(url)

  return new Promise((resolve, reject) => {
    client.once('ready', () => resolve(client))
    client.once('error', error => reject(error))
  })
}

function makeRenderer() {
  // Setup variables for our template
  const templatePath = resolve(__dirname, 'index.template.html')
  const template = readFileSync(templatePath, 'utf-8')

  // Setup a renderer to render our vue app
  return createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest
  })
}

module.exports = {
  redisGetJson,
  generateMeta,
  makeExiter,
  connectToRedis,
  makeRenderer
}
