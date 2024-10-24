import fs from 'fs'
import express from 'express'
import { createServer } from 'vite'

const port = process.env.PORT || 5173

const app = express()

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
})

app.use(vite.middlewares)

app.use('*all', async (req, res) => {
  const url = req.originalUrl

  try {
    const template = await vite.transformIndexHtml(
      url,
      fs.readFileSync('index.html', 'utf-8')
    )
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

    const { getMultipleProducts } = await vite.ssrLoadModule('/src/api.ts')
    const data = await getMultipleProducts()
    const script = `<script>window.__data__=${JSON.stringify(data)}</script>`

    const html = template.replace(
      `<!--ssr-outlet-->`,
      `${render(data)} ${script}`
    )
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (error) {
    res.status(500).end(error.message)
  }
})

app.listen(port, () => {
  console.info(`Server started at: http://localhost:${port}`)
})
