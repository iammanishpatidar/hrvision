import { HttpContext } from '@adonisjs/core/http';
import CompensationService from './compensation.service.js';
import { customError } from '../../utilities/error_handler.js';
import { genericResponse } from '../../utilities/response_handler.js';
import CompensationValidator from './compensation.validator.js';
import Compensation from './compensation.model.js';
import snakecaseKeys from 'snakecase-keys';

export default class CompensationController {
  private compensationService: CompensationService;

  constructor() {
    this.compensationService = new CompensationService();
  }

  public async create({ request, response }: HttpContext) {
    try {
      const rawPayload: Partial<Compensation> = request.only([
        'employee_id',
        'base_salary',
        'base_rate_period',
        'salary_schedule',
        'total_allowance',
        'net_salary',
        'currency',
      ]);
      await CompensationValidator.fire(rawPayload, 'create');
      const compensation = await this.compensationService.create(rawPayload);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(compensation.toJSON(), { deep: true }),
        message: 'Compensation created successfully',
      });
    } catch (error) {
      return customError(
        { request, response },
        'Failed to create compensation',
        400,
        error
      );
    }
  }

  public async fetchByEmployeeId({ params, request, response }: HttpContext) {
    try {
      const employeeId = params.employeeId;
      const compensations = await this.compensationService.fetchByEmployeeId(employeeId);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(compensations.map(comp => comp.toJSON()), { deep: true }),
        message: 'Compensations fetched successfully by employee',
      });
    } catch (error) {
      return customError(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async get({ params, request, response }: HttpContext) {
    try {
      const id = params.id;
      await CompensationValidator.validateId(id);
      const compensation = await this.compensationService.get(id);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(compensation.toJSON(), { deep: true }),
        message: 'Compensation fetched successfully',
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

  public async update({ params, request, response }: HttpContext) {
    try {
      const id = params.id;
      await CompensationValidator.validateId(id);
      
      // Only extract mutable fields
      const rawPayload: Partial<Compensation> = request.only([
        'base_salary',
        'total_allowance',
        'net_salary',
      ]);
      
      // Include the id in the payload for update validation
      const updatePayload = { id, ...rawPayload };
      await CompensationValidator.fire(updatePayload, 'update');
      const compensation = await this.compensationService.update(id, rawPayload);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(compensation.toJSON(), { deep: true }),
        message: 'Compensation updated successfully',
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

  public async delete({ params, request, response }: HttpContext) {
    try {
      const id = params.id;
      await CompensationValidator.validateId(id);
      await this.compensationService.delete(id);

      return genericResponse({
        request,
        response,
        data: null,
        message: 'Compensation deleted successfully',
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
