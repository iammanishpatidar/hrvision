import { HttpContext } from '@adonisjs/core/http';
import BusinessService from './business.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import businessValidator from './business.validator.js';
import snakecaseKeys from 'snakecase-keys';
import { CreateBusinessPayload } from './business.types.js';

export default class BusinessController {
  private businessService: BusinessService;

  constructor() {
    this.businessService = new BusinessService();
  }

  /**
   * Register a new business with admin user
   */
  public async register({ request, response }: HttpContext) {
    try {
      const rawPayload = request.all();
      await businessValidator.fire(rawPayload, 'create');
      const payload = rawPayload as CreateBusinessPayload;
      const { business, employee } =
        await this.businessService.createBusiness(payload);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            business: business.toJSON(),
            employee: employee.toJSON(),
          },
          { deep: true }
        ),
        message: 'Business registered successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  /**
   * Update an existing business
   */
  public async updateBusiness({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const id = request.param('id');
      await businessValidator.validateId(id);
      await businessValidator.fire(payload, 'update');
      const updatedBusiness = await this.businessService.updateBusiness(
        id,
        payload
      );
      return genericResponse({
        request,
        response,
        data: updatedBusiness,
        message: 'business updated successfully',
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

  /**
   * Delete a business by ID
   */
  public async deleteBusinessById({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      await this.businessService.deleteBusiness(id);
      return genericResponse({
        request,
        response,
        data: null,
        message: 'Business deleted successfully',
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

  /**
   * Fetch business(es)
   */
  public async fetchBusiness({ request, response }: HttpContext) {
    try {
      const id = request.qs().id;
      const businesses = await this.businessService.fetchBusiness(id);
      return genericResponse({
        request,
        response,
        data: businesses,
        message: id
          ? 'Business fetched successfully'
          : 'All businesses fetched successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Internal server error';
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  /**
   * Upload Business Logo
   */
  public async uploadBusinessLogo({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      await businessValidator.validateId(id);
      const logo = request.file('logo');
      if (!logo) {
        throw new Error('Logo file is required');
      }
      await businessValidator.fire({ logo }, 'uploadLogo');
      const updatedBusiness = await this.businessService.uploadBusinessLogo(
        id,
        logo
      );
      return genericResponse({
        request,
        response,
        data: updatedBusiness,
        message: 'Business logo uploaded successfully',
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
