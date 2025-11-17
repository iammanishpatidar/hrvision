import { Exception } from '@adonisjs/core/exceptions';

export default class CustomError extends Exception {
  constructor(message: string, statusCode: number) {
    super(message, { status: statusCode });
    this.status = statusCode;
  }
}
