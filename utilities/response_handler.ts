import _ from 'lodash';
import { HttpContext } from '@adonisjs/core/http';

export interface GenericResponseOptions
  extends Pick<HttpContext, 'request' | 'response'> {
  data?: any;
  message?: string;
}

export const genericResponse = async ({
  request,
  response,
  data,
  message,
}: GenericResponseOptions): Promise<void> => {
  const responseData: { statusCode: number; data: any; message: string } = {
    statusCode: 500,
    data: {},
    message: 'Something went wrong, please try again!',
  };

  if (_.isEmpty(request.input('error'))) {
    responseData.statusCode = 200;
    responseData.data = data || request.all() || {};
    responseData.message = message || request.input('message') || 'OK';
  }

  response.status(responseData.statusCode).json(responseData);
};
