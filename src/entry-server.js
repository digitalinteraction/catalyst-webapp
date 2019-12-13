import { makeApp } from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = makeApp(context)

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // Once rendered, update our state object
      // to be passed to window.__INITIAL_STATE__
      context.rendered = () => {
        context.state = store.state
      }

      if (matchedComponents.length === 0) {
        const error = new Error(`Not found: ${context.url}`)
        error.code = 404
        return reject(error)
      }

      resolve(app)
    }, reject)
  })
}
