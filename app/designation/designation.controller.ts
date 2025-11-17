import { HttpContext } from '@adonisjs/core/http';
import DesignationService from './designation.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import snakecaseKeys from 'snakecase-keys';
import designationValidator from './designation.validator.js';

export default class DesignationController {
  private designationService: DesignationService;

  constructor() {
    this.designationService = new DesignationService();
  }

  public async getAllDesignations({ request, response }: HttpContext) {
    try {
      const designations = await this.designationService.getAllDesignations();

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          designations.map((designation) => designation.toJSON()),
          { deep: true }
        ),
        message: 'Designations fetched successfully',
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

  public async getDesignationById({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      
      await designationValidator.validateId(id);
      const designation = await this.designationService.getDesignationById(id);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(designation.toJSON(), { deep: true }),
        message: 'Designation fetched successfully',
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