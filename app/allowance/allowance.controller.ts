import { HttpContext } from '@adonisjs/core/http';
import AllowanceService from './allowance.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';

export default class AllowanceController {
  private allowanceService: AllowanceService;

  constructor() {
    this.allowanceService = new AllowanceService();
  }

  public async createAllowance({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const allowance = await this.allowanceService.createAllowance(payload);
      return genericResponse({
        request,
        response,
        data: allowance,
        message: 'Allowance created successfully',
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

  public async updateAllowance({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const allowance = await this.allowanceService.updateAllowance(
        request.param('id'),
        payload
      );
      return genericResponse({
        request,
        response,
        data: allowance,
        message: 'Allowance updated successfully',
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

  public async deleteAllowance({ request, response }: HttpContext) {
    try {
      const allowance = await this.allowanceService.deleteAllowance(
        request.param('id')
      );
      return genericResponse({
        request,
        response,
        data: allowance,
        message: 'Allowance deleted successfully',
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

  public async fetchAllowanceById({ request, response }: HttpContext) {
    try {
      const allowance = await this.allowanceService.fetchAllowanceById(
        request.param('id')
      );
      return genericResponse({
        request,
        response,
        data: allowance,
        message: 'Allowance fetched successfully',
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

  public async fetchAllowanceByBusinessId({ request, response }: HttpContext) {
    try {
      const businessId = request.param('businessId');
      const page = Number(request.qs().page) || 1;
      const limit = Number(request.qs().limit) || 10;
      const allowance = await this.allowanceService.fetchAllowancesByBusinessId(
        businessId,
        page,
        limit
      );
      return genericResponse({
        request,
        response,
        data: { data: allowance.data, meta: allowance.meta },
        message: 'Allowance fetched successfully',
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
