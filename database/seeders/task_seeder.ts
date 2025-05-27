import Task from '#models/task'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Task.createMany([
      {
        title: 'Estudar ReactJS',
        description: 'Estou estudando fundamentos de React',
        userId: 1,
      },
      {
        title: 'Estudar NodeJS',
        description: 'Estou estudando fundamentos de Node',
        userId: 2,
      },
      {
        title: 'Estudar JavaScript',
        description: 'Estou estudando fundamentos de JavaScript',
        userId: 3,
      },
      {
        title: 'Estudar TypeScript',
        description: 'Estou estudando fundamentos de TypeScript',
        userId: 3,
      },
    ])
  }
}