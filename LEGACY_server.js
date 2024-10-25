// Vanilla Node.js imports
import fs from 'fs'
import path from 'path'

/**
  It is possible to split this file into 2 separate files, one for development and one for production and adjust the package.json scripts accordingly, however, it's easier to teach and understand the code when it's all in one file, as you can see the differences between the development and production code side-by-side.
 */

// For production. We need to use the `fileURLToPath` function to convert the import.meta.url to a path
import { fileURLToPath } from 'url'

// Express library
import express from 'express'

// Environment variables declaration
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Create express/http server
const app = express()

// Add Vite or respective production middlewares
let vite
let data
// Vite is only used in development
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  })

  app.use(vite.middlewares)

  // Pulling from src directory. Server-side data fetching to populate the initial data, and get passed to the client-side as a prop, which can be displayed in the browser even if JavaScript is turned off, or before hydration.
  const { getMultipleProducts } = await vite.ssrLoadModule('/src/api.ts')
  data = await getMultipleProducts()
}
// We do not need to use Vite in production, only NodeJS & its Express library
if (isProduction) {
  app.use(
    // express.static is used to serve static files such as images, CSS, & JavaScript files
    express.static(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist/client'),
      { index: false }
    )
  )

  // In production, we pull from transpiled 'dist' directory
  const { getMultipleProducts } = await import('./dist/api/api.js')
  data = await getMultipleProducts()

  // Compress payload size. Docs: https://github.com/expressjs/compression?tab=readme-ov-file#expressconnect
  const compression = (await import('compression')).default
  app.use(compression())
}

// Serve HTML
app.use('*all', async (req, res) => {
  // This DOM element will populate 'window.__data__' with the data we fetched from the server, which will allow React to use it on the client-side.
  const script = `<script>window.__data__=${JSON.stringify(data)}</script>`

  try {
    // Development
    if (!isProduction) {
      const url = req.originalUrl

      const developmentTemplate = await vite.transformIndexHtml(
        url,
        fs.readFileSync('index.html', 'utf-8')
      )
      // In development, we pull from the src directory
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

      const developmentHtml = developmentTemplate.replace(
        // The `<!--ssr-outlet-->` placeholder below must match the placeholder string in your `index.html` file's root element, for all environments. You can name this placeholder anything you want, but they must match.
        `<!--ssr-outlet-->`,
        `${render(data)} ${script}`
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).send(developmentHtml)
    }
  } catch (error) {
    vite?.ssrFixStacktrace(error)
    console.error(error.stack)
    res.status(500).end(error.stack)
  }

  // Again, we do not need to use Vite in production, only NodeJS & Express
  if (isProduction) {
    try {
      const productionTemplate = fs.readFileSync(
        './dist/client/index.html',
        'utf-8'
      )
      // Post transpilation, that's why it's .js and not .ts
      const { render } = await import('./dist/server/entry-server.js')

      const productionHtml = productionTemplate.replace(
        `<!--ssr-outlet-->`,
        `${render(data)} ${script}`
      )

      res.status(200).set({ 'Content-Type': 'text/html' }).send(productionHtml)
    } catch (error) {
      console.error(error.stack)
      res.status(500).end(error.stack)
    }
  }
})

// Start http server
app.listen(port, () => {
  console.info(`Server started at: http://localhost:${port}`)
})
