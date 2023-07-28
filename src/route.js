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

      if(!title || !description) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'title and description are required'
        }))
      }

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

      const task = database.select('tasks').find(row => row.id === id)

      if(!task) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'task not found'
        }))
      }

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

      if (!title || !description) {
        return res.writeHead(404).end(JSON.stringify({
          message: 'title and description are required'
        }))
      }

      const task = database.select('tasks').find(row => row.id === id)

      database.update('tasks', id,
        {
          title,
          description,
          completed_at: task.completed_at,
          created_at: task.created_at,
          updated_at: new Date(),
        })

      return res.writeHead(204).end(JSON.stringify({
        message: 'task successfully updated'
      }))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/completed'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks').find(row => row.id === id)

      if (task.completed_at === null) {
        database.complete('tasks', id, {
          title: task.title,
          description: task.description,
          completed_at: new Date(),
          created_at: task.created_at,
          updated_at: new Date()
        })

        return res.writeHead(204).end()
      }

      database.complete('tasks', id, {
        title: task.title,
        description: task.description,
        completed_at: null,
        created_at: task.created_at,
        updated_at: new Date()
      })



      return res.writeHead(204).end(JSON.stringify({
        message: 'task successfully completed'
      }))
    }
  }
]