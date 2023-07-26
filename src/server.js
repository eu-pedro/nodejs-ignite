import http from 'node:http';
import { Json } from './middlewares/json.js';
import { Database } from './database.js';
import { randomUUID } from 'node:crypto';

const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await Json(req, res)

  if(method === 'GET' && url === '/tasks') {
    const tasks = database.select('tasks')
    return res.end(JSON.stringify(tasks)) 
  }

  if(method === 'POST' && url === '/tasks') {
    const { title, description } = req.body

    database.insert('tasks', {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    })
    
    return res.writeHead(201).end('criação de task')
  }

  return res.writeHead(404).end('Essa rota não existe!')
})

server.listen(3000)