import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        name: 'Felipe Jovino',
        email: 'felipejovino@gmail.com',
        password: 'secret',
      },
      {
        name: 'Cassiano Campos',
        email: 'cassianocampos@gmail.com',
        password: 'secret',
      },
      {
        name: 'Gilberto Bispo',
        email: 'gilbertobispo@gmail.com',
        password: 'secret',
      },
    ])
  }
}