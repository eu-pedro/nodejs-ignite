import http from 'node:http';
import { Json } from './middlewares/json.js';
import { routes } from './route.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await Json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Essa rota não existe!')
})

server.listen(3000, () => {
  return console.log('server is running...🚀')
})