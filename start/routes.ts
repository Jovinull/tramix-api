import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.group(() => {
  router.get('/users', [UsersController, 'index']).as('users.index')
  router.post('/users', [UsersController, 'store']).as('users.store')
  router.get('/users/:id', [UsersController, 'show']).as('users.show')
  router.put('/users/:id', [UsersController, 'update']).as('users.update')
  router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')
})
.prefix('/api')
.as('api')
