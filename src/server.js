import http from 'node:http';

const tasks = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if(method === 'GET' && url === '/tasks') {
    return res
            .end('Listagem de task') 
            
  }

  if(method === 'POST' && url === '/tasks') {
    return res.end('criação de task')
  }

  return res.end('Olá mundo')
})

server.listen(3000)