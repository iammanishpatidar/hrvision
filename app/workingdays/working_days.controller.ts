import { HttpContext } from '@adonisjs/core/http';
import WorkingDaysService from './working_days.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import workingDaysValidator from './working_days.validators.js';
import snakecaseKeys from 'snakecase-keys';

export default class WorkingDayController {
  private workingDaysService: WorkingDaysService;
  constructor() {
    this.workingDaysService = new WorkingDaysService();
  }

  public async findAllDays({ request, response }: HttpContext) {
    try {
      const workingDays = await this.workingDaysService.findAllDays();
      const responseData = workingDays.map((day) => day.toJSON());
      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ workingDays: responseData }, { deep: true }),
        message: 'All days fetched successfully',
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

  public async findDayById({ request, response }: HttpContext) {
    try {
      await workingDaysValidator.validateId(request.param('id'));
      const workingDay = await this.workingDaysService.findDayById(
        request.param('id')
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          { workingDay: workingDay.toJSON() },
          { deep: true }
        ),
        message: 'day fetched successfully',
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

  public async createBusinessAndWorkingDaysMappings({
    request,
    response,
  }: HttpContext) {
    try {
      const rawPayload = request.all();
      await workingDaysValidator.fire(rawPayload, 'create');
      const payload = rawPayload as {
        business_id: string;
        working_days_id: string;
      };
      const mapping =
        await this.workingDaysService.createBusinessAndWorkingDaysMappings(
          payload
        );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            business_and_working_days: mapping.toJSON(),
          },
          { deep: true }
        ),
        message: 'Business And Working Days Mapping processed successfully',
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

  public async findByBusinessId({ request, response }: HttpContext) {
    try {
      await workingDaysValidator.validateId(request.param('id'));
      const workingDays = await this.workingDaysService.findByBusinessId(
        request.param('id')
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          { working_days: workingDays.map((w) => w.toJSON()) },
          { deep: true }
        ),
        message: 'day fetched successfully',
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
