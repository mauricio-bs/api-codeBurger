import { Router } from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import authMiddleware from './app/middlewares/auth'

import ProductController from './app/controllers/ProductController'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import OrderController from './app/controllers/OrderController'
import CategoryController from './app/controllers/CategoryController'

const upload = multer(multerConfig)

const routes = new Router()

// User
routes.post('/users', UserController.store)

routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)
// Products
routes.post('/products', upload.single('file'), ProductController.store)
routes.get('/products', ProductController.index)
routes.put('/products', upload.single('file'), ProductController.update)

// Categories
routes.post('/categories', upload.single('category'), CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put(
  '/categories/:id',
  upload.single('category'),
  CategoryController.update
)

// Orders
routes.get('/orders', OrderController.index)
routes.get('/orders/:id', OrderController.show)
routes.post('/orders', OrderController.store)
routes.post('/orders/:id', OrderController.update)
routes.delete('/orders/:id', OrderController.delete)

export default routes
