import { BadRequestError, validateRequest } from '@gittexing/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { Password } from '../services/password'

const router = express.Router()

const validationSchema = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('you must supply a password'),
]

router.post(
  '/api/users/signin',
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) throw new BadRequestError('invalid credentials ')

    const isValidPassword = await Password.compare(user.password, password)
    if (!isValidPassword) throw new BadRequestError('invalid credentials ')

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    req.session = {
      jwt: userJwt,
    }

    res.status(200).send(user)
  }
)

export { router as signinRouter }
