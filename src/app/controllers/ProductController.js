import * as yup from 'yup'
import Products from '../models/Product'

class ProductsController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      price: yup.number().required(),
      category: yup.string().required(),
    })

    try {
      await schema.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const { filename: path } = req.file
    const { name, price, category } = req.body

    const product = await Products.create({
      name,
      price,
      category,
      path,
    })

    return res.json(product)
  }

  async index(req, res) {
    const products = await Products.findAll()

    return res.status(200).json(products)
  }
}

export default new ProductsController()
