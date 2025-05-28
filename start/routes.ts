import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';

const UsersController = () => import('#controllers/users_controller');
const TasksController = () => import('#controllers/tasks_controller');
const SessionController = () => import('#controllers/session_controller');

router
  .group(() => {
    // Rotas públicas
    router.post('/sessions', [SessionController, 'store']).as('sessions.store');

    router.get('/users', [UsersController, 'index']).as('users.index');
    router.post('/users', [UsersController, 'store']).as('users.store');
    router.get('/users/:id', [UsersController, 'show']).as('users.show');
    router.put('/users/:id', [UsersController, 'update']).as('users.update');
    router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy');

    // Rotas protegidas por auth()
    router
      .group(() => {
        router.get('/tasks', [TasksController, 'index']).as('tasks.index');
        router.post('/tasks', [TasksController, 'store']).as('tasks.store');
        router.get('/tasks/:id', [TasksController, 'show']).as('tasks.show');
        router.put('/tasks/:id', [TasksController, 'update']).as('tasks.update');
        router.delete('/tasks/:id', [TasksController, 'destroy']).as('tasks.destroy');
      })
      .use(middleware.auth());
  })
  .prefix('/api')
  .as('api');
