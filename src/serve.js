import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'

const dir =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))

const liveReloadServer = livereload.createServer()
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/')
  }, 100)
})

liveReloadServer.watch(join(dir, 'test-browser'))

const app = express()
const port = 3000

app.use(connectLiveReload())
app.use(express.static(resolve(dir, './test-browser/')))
app.use('/js', express.static(resolve(dir, '../lib/')))

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
})
