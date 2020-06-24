import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors'
import { validateRequest } from '../middlewares/validate-request'
import { User } from '../models'

const router = express.Router()

const validationSchema = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('password must be between 4 and 20 characters'),
]

router.post(
  '/api/users/signup',
  validateRequest(validationSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (user) throw new BadRequestError('User Already Exist')

    user = User.build({ email, password })
    await user.save()

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

    res.status(201).send(user)
  }
)

export { router as signupRouter }
