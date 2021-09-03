import yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
      })
      try {
        await schema.validateSync(req.body)
      } catch (err) {
        return res.status(400).json({ errror: err.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) res.status(401).json()

      const { name } = req.body

      const categoryExists = await Category.findOne({ where: { name } })

      if (categoryExists) {
        return res.status(400).json({ error: 'Category already exists' })
      }

      const { id } = await Category.create({ name })

      return res.status(201).json({ id, name })
    } catch (err) {
      return res.json({ error: err })
    }
  }

  async index(req, res) {
    try {
      const categories = await Category.findAll()

      return res.status(200).json(categories)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

export default new CategoryController()
