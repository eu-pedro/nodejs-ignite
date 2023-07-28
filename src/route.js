import { Database } from "./database.js"
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      database.insert('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      })

      return res.writeHead(201).end(JSON.stringify({
        message: 'task created successfully'
      }))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      database.delete('tasks', id)

      return res.writeHead(204).end(JSON.stringify({
        message: 'task successfully deleted!'
      }))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params

      if(!title ||!description){
        return res.writeHead(404).end(JSON.stringify({
          message: 'title and description are required'
        }))
      }

      database.update('tasks', id,
        {
          title,
          description,
          updated_at: new Date(),
        })



      return res.writeHead(204).end(JSON.stringify({
        message: 'task successfully updated'
      }))
    }
  }
]