// Vanilla Node.js imports
import fs from 'fs'
import path from 'path'

// For production, we need to use the `fileURLToPath` function to convert the import.meta.url to a path
import { fileURLToPath } from 'url'

// Express library
import express from 'express'

// Environment variables declaration
const port = process.env.PORT || 5173

// Create express/http server
const app = express()

app.use(
  express.static(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist/client'),
    { index: false }
  )
)

// Compress payload size. Docs: https://github.com/expressjs/compression?tab=readme-ov-file#expressconnect
const compression = (await import('compression')).default
app.use(compression())

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const productionTemplate = fs.readFileSync(
      './dist/client/index.html',
      'utf-8'
    )
    const { render } = await import('./dist/server/entry-server.js')

    const { getMultipleProducts } = await import('./dist/api/api.js')
    const data = await getMultipleProducts()
    const script = `<script>window.__data__=${JSON.stringify(data)}</script>`
    console.log('data', data)
    const productionHtml = productionTemplate.replace(
      `<!--ssr-outlet-->`,
      `${render(data)} ${script}`
    )

    res.status(200).set({ 'Content-Type': 'text/html' }).send(productionHtml)
  } catch (error) {
    console.error(error.stack)
    res.status(500).end(error.message)
  }
})

// Start http server
app.listen(port, () => {
  console.info(`Server started at: http://localhost:${port}`)
})
