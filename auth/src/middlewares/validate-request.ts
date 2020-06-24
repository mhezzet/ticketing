import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors'

export const validateRequest = (validations: ValidationChain[]) => [
  ...validations,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }

    next()
  },
]
