import * as yup from 'yup'
import { v4 } from 'uuid'

import User from '../models/User'
/*
Controller defaults

Store - To store data in database
index - To find most data in database
show - To find just one data in database
update - To update data on database
delete - To delete data on database
*/

class UserController {
  async store(req, res) {
    // Validation shape
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password_hash: yup.string().required(),
      admin: yup.boolean(),
    })

    // if (!(await schema.validateSync(req.body))) {
    //   return res.status(400).json({})
    // }

    try {
      // Validate data recived
      await schema.validateSync(req.body, { abortEarly: false })
    } catch (err) {
      // Data isn't valid
      return res.status(400).json({ error: err.errors })
    }

    const { name, email, password, admin } = req.body

    // Find user by email
    const userExists = User.findOne({ where: { email } })

    // User already exists
    if (userExists) res.status(400).json({ error: 'User already exists' })

    // Create user
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })
    return res.status(201).json({ id: user.id, name, email, admin })
  }
}

export default new UserController()
