import LeaveTypesService from './leave_types.service.js';
import { HttpContext } from '@adonisjs/core/http';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import leaveTypesValidator from './leave_types.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class LeaveTypesController {
  private leaveTypesService: LeaveTypesService;

  constructor() {
    this.leaveTypesService = new LeaveTypesService();
  }

  async createLeaveTypes({ request, response }: HttpContext) {
    try {
      await leaveTypesValidator.fire(request.all(), 'create');
      const leave = await this.leaveTypesService.createLeaveTypes(
        request.all()
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(JSON.parse(JSON.stringify(leave)), { deep: true }),
        message: 'Leave created successfully',
      });
    } catch (error) {
      console.log('createLeave() ', error);
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

  async updateLeaveTypes({ params, request, response }: HttpContext) {
    try {
      await leaveTypesValidator.fire(
        { id: params.id, ...request.all() },
        'update'
      );
      const leave = await this.leaveTypesService.updateLeaveTypes(
        params.id,
        request.all()
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(JSON.parse(JSON.stringify(leave)), { deep: true }),
        message: 'Leave type updated successfully',
      });
    } catch (error) {
      console.log('updateLeaveTypes() ', error);
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

  async deleteLeaveTypes({ params, request, response }: HttpContext) {
    try {
      await leaveTypesValidator.fire({ id: params.id }, 'delete');
      await this.leaveTypesService.deleteLeaveTypes(params.id);
      return genericResponse({
        request,
        response,
        data: {},
        message: 'Leave type deleted successfully',
      });
    } catch (error) {
      console.log('deleteLeaveTypes() ', error);
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

  async fetchLeaveTypes({ params, request, response }: HttpContext) {
    try {
      const { business_id } = params;
      const { leave_type_id } = request.qs();

      await leaveTypesValidator.fire({ business_id, leave_type_id }, 'fetch');
      const leave = await this.leaveTypesService.fetchLeaveTypes(
        business_id,
        leave_type_id
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(JSON.parse(JSON.stringify(leave)), { deep: true }),
        message: leave_type_id
          ? 'Leave type fetched successfully'
          : 'Leave types fetched successfully',
      });
    } catch (error) {
      console.log('fetchLeaveTypes() ', error);
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
