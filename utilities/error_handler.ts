import { HttpContext } from '@adonisjs/core/http';
import { ValidationException } from '@adonisjs/validator';

type ErrorHandlerContext = Pick<HttpContext, 'request' | 'response'>;

export const commonRequestErrorHandler = async (
  { request, response }: ErrorHandlerContext,
  message: string,
  statusCode: number = 500,
  error?: unknown
): Promise<void> => {
  let errorMessage = message;
  let status = statusCode;
  let errorData: any = {};

  if (error instanceof ValidationException) {
    status = 400;
    errorMessage = 'Validation failed';
    errorData = error.messages;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = (error as Error).message;
  }

  if (error && typeof error === 'object' && 'status' in error) {
    status = (error as any).status;
  }

  console.error(
    `[ERROR] ${request.method()} ${request.url()} | ${status} - ${errorMessage}`
  );
  if (error && typeof error === 'object' && 'stack' in error) {
    console.error((error as Error).stack);
  }

  response.status(status).json({
    statusCode: status,
    data: errorData,
    message: errorMessage,
  });
};

// Added alias to ensure 'customError' is exported for controllers
export const customError = commonRequestErrorHandler;
