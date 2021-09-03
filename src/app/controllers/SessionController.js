import * as yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
  async store(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    })

    const userEmailOrPasswordIncorrect = () => {
      return res
        .status(400)
        .json({ error: 'Make sure yur password or email are correct' })
    }

    if (!(await schema.isValid(req.body))) userEmailOrPasswordIncorrect()

    const { email, password } = req.body

    const user = User.findOne({ where: { email } })

    if (!user) {
      userEmailOrPasswordIncorrect()
    }

    if (!(await user.checkPassword(password))) userEmailOrPasswordIncorrect()

    return res.status(200).json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}
export default new SessionController()
