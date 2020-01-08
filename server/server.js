const { resolve } = require('path')

const express = require('express')
const favicon = require('serve-favicon')
const debug = require('debug')('catalyst:server')

const { renderVueApp, makeVueState } = require('./vue')
const { generateMeta } = require('./utils')

function makeServer(redisClient, renderer) {
  const {
    PUBLIC_URL,
    API_URL,
    APP_NAME = 'Catalyst',
    APP_INFO = 'Search, browse and find Catalyst projects',
    TWITTER_HANDLE = ''
  } = process.env

  debug(
    `#makeServer public=${PUBLIC_URL} api=${API_URL} appName=${APP_NAME} appInfo=${APP_INFO}`
  )

  const app = express()
  app.use(favicon('./public/favicon.png'))
  app.use('/js', express.static(resolve(__dirname, '../dist/js')))
  app.use('/img', express.static(resolve(__dirname, '../dist/img')))
  app.use('/css', express.static(resolve(__dirname, '../dist/css')))
  app.use('/public', express.static(resolve(__dirname, '../public')))

  app.use((req, res, next) => {
    debug(`${req.method}: ${req.path} params=${JSON.stringify(req.query)}`)
  })

  // Handle a project route specifically
  app.get('/project/:id', async (req, res, next) => {
    const state = await makeVueState(redisClient, API_URL)

    const project = state.api.projects.find(p => p.id === req.params.id)

    // If the project wasn't found, try another route
    if (!project) return next()

    const meta = generateMeta(
      req.url,
      PUBLIC_URL,
      `${APP_NAME} Project`,
      TWITTER_HANDLE,
      [{ property: 'og:description', content: project.name }]
    )

    // Render the project route, with specific metadata
    renderVueApp(res, renderer, req.url, {
      title: `Project | Not-Equal Catalyst`,
      meta,
      state
    })
  })

  // Handle every other route by rendering the vue app
  app.use('*', async (req, res) => {
    const state = await makeVueState(redisClient, API_URL)

    // Generate opengraph metadata
    const meta = generateMeta(
      req.originalUrl,
      PUBLIC_URL,
      APP_NAME,
      TWITTER_HANDLE,
      [{ property: 'og:description', content: APP_INFO }]
    )

    // Render the view app
    renderVueApp(res, renderer, req.originalUrl, {
      title: APP_NAME,
      meta,
      state
    })
  })

  return app
}

module.exports = { makeServer }
