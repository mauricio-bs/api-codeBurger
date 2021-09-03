import Order from '../schemas/Order'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'
import yup from 'yup'

class OrderController {
  async index(req, res) {
    try {
      const orders = await Order.find({})
      return res.status(200).json(orders)
    } catch (err) {
      return res.status(500).json({ error: err })
    }
  }

  async show(req, res) {
    const { id } = req.params

    try {
      const order = await Order.findById(id)

      if (!order) throw new Error()

      return res.status(200).json(order)
    } catch (err) {
      return res.status(400).json({ error: 'Order not found' })
    }
  }

  async store(req, res) {
    const schema = yup.object().shape({
      product: yup
        .array()
        .required()
        .of(
          yup.object().shape({
            id: yup.number().required(),
            quantity: yup.number().required(),
          })
        ),
    })

    try {
      await schema.validateSync(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const products_ids = req.body.product.map((product) => product.id)

    const updatedProducts = await Product.findAll({
      where: { id: products_ids },
      include: [{ model: Category, as: 'Category', attributes: ['name'] }],
    })

    const editedProducts = updatedProducts.map((product) => {
      const productsIndex = req.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id
      )

      const newProducts = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: req.body.products[productsIndex].quantity,
      }
      return newProducts
    })

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: editedProducts,
      status: 'Pedido realizado',
    }

    try {
      await Order.create(order)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(201).json({ message: 'Order created successfully' })
  }

  async update(req, res) {
    const { id } = req.params
    const { status } = req.body

    const schema = yup.object().shape({
      status: yup.string().required(),
    })

    try {
      await schema.validateSync(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(req.userId)

    if (!isAdmin) res.status(401).json()

    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    return res.status(200).json({ message: 'status updated successfully' })
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const order = await Order.findById(id)

      if (!order) throw new Error()
    } catch (err) {
      return res.status(400).json({ error: 'Order not found' })
    }

    try {
      await Order.deleteOne({ id })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete order' })
    }

    return res.status(204).json()
  }
}

export default new OrderController()
