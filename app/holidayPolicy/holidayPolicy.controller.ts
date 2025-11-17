import type { HttpContext } from '@adonisjs/core/http';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import { genericResponse } from '../../utilities/response_handler.js';
import HolidayPolicyService from './holidayPolicy.service.js';
import holidayPolicyValidator from './holidayPolicy.validator.js';

export default class HolidayLeaveController {
  private holidayPolicyService: HolidayPolicyService;

  constructor() {
    this.holidayPolicyService = new HolidayPolicyService();
  }

  public async create({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await holidayPolicyValidator.fire(payload, 'create');
      const holidayLeave = await this.holidayPolicyService.create(payload);
      return genericResponse({
        request,
        response,
        data: holidayLeave,
        message: 'Holiday created successfully',
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

  public async update({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      const payload = request.all();
      await holidayPolicyValidator.fire(payload, 'update');
      const holidayLeave = await this.holidayPolicyService.updateHoliday(
        id,
        payload
      );
      return genericResponse({
        request,
        response,
        data: holidayLeave,
        message: 'Holiday updated successfully',
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

  public async fetchHolidays({ request, response }: HttpContext) {
    try {
      const { month, holidayId, page, limit } = request.qs();
      const businessId = request.param('businessId');
      const holidays = await this.holidayPolicyService.getAllHolidays(
        businessId,
        {
          month: month ? Number(month) : undefined,
          holidayId,
          page: page ? Number(page) : 1,
          limit: limit ? Number(limit) : 10,
        }
      );
      return genericResponse({
        request,
        response,
        data: holidays,
        message: holidayId
          ? 'Specific holiday fetched successfully'
          : month
            ? `Holidays for month ${month} fetched successfully`
            : 'All holidays fetched successfully',
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

  public async deleteHolidayById({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      await this.holidayPolicyService.deleteHolidayById(id);
      return genericResponse({
        request,
        response,
        data: { deleted: true },
        message: 'Holiday deleted successfully',
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
}
