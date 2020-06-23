import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError, BadRequestError } from '../errors'
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
  [...validationSchema],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (user) throw new BadRequestError('User Already Exist')

    user = User.build({ email, password })
    await user.save()

    res.status(201).send(user)
  }
)

export { router as signupRouter }
