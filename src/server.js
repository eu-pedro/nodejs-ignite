import http from 'node:http';
import { Json } from './middlewares/json.js';
import { routes } from './route.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await Json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url) 
  })

  if(route) {
    const routeParams = req.url.match(route.path)

    req.params = {...routeParams.groups}

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Essa rota não existe!')
})

server.listen(3000)