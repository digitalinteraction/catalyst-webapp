const { redisGetJson } = require('./utils')

async function makeVueState(db, apiUrl) {
  const [projects, labels, content] = await Promise.all([
    redisGetJson(db, 'cards'),
    redisGetJson(db, 'labels'),
    redisGetJson(db, 'content')
  ])

  const api = {
    projects,
    labels,
    content,
    url: apiUrl
  }

  return { api }
}

async function renderVueApp(res, renderer, url, context) {
  res.setHeader('Content-Type', 'text/html')

  context.url = url
  // context.meta = context.meta || ''
  // context.apiUrl = apiUrl

  try {
    res.end(await renderer.renderToString(context))
  } catch (error) {
    if (error.code !== 404 || error.message.match(/^not found$/i)) {
      console.log(error)
    }

    if (error.url) {
      res.redirect(error.url)
    } else {
      // Render Error Page or Redirect
      res.status(error.code || 500).end(error.message)
      console.error(`error during render : ${url}`)
      console.error(error)
    }
  }
}

module.exports = { renderVueApp, makeVueState }
