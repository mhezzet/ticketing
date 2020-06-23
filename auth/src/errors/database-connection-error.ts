import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
  reason = 'Error conncecting to database'
  statusCode = 500

  constructor() {
    super('Error conncecting to database')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.reason }]
  }
}
