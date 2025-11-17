import { HttpContext } from '@adonisjs/core/http';
import AddressService from './address.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import addressValidator from './address.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class AllowanceController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  public async updateAddress({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const { id } = request.params();
      await addressValidator.fire(payload, 'update');
      await addressValidator.validateId(id);

      const address = await this.addressService.updateAddress(id, payload);

      if (!address) {
        return commonRequestErrorHandler(
          { request, response },
          'Address not found or update failed.',
          404
        );
      }

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            updated_address: address.toJSON(),
          },
          { deep: true }
        ),
        message: 'Address updated successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage;
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async fetchAddress({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      await addressValidator.validateId(id);
      const address = await this.addressService.getAddressById(id);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            address: address.toJSON(),
          },
          { deep: true }
        ),
        message: 'Address fetched successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage;
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }
}
