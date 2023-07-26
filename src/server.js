import http from 'node:http';
import { Json } from './middlewares/json.js';
import { routes } from './route.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await Json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path === url
  })

  if(route) {
    return route.handler(req, res)
  }

  console.log(route)

  return res.writeHead(404).end('Essa rota não existe!')
})

server.listen(3000)