import { HttpContext } from '@adonisjs/core/http';
import JobTitleService from './job_titles.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import jobTitleValidator from './job_titles.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class JobTitleController {
  private jobTitleService: JobTitleService;

  constructor() {
    this.jobTitleService = new JobTitleService();
  }

  public async createJobTitle({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await jobTitleValidator.fire(payload, 'create');

      const jobTitle = await this.jobTitleService.createJobTitle(
        payload as {
          title: string;
          description: string;
          business_id: string;
        }
      );

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(jobTitle.toJSON(), { deep: true }),
        message: 'Job title created successfully',
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

  public async updateJobTitle({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const id = request.param('id');

      await jobTitleValidator.validateId(id);
      await jobTitleValidator.fire(payload, 'update');

      const updatedJobTitle = await this.jobTitleService.updateJobTitle(
        id,
        payload
      );

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(updatedJobTitle.toJSON(), { deep: true }),
        message: 'Job title updated successfully',
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

  public async deleteJobTitle({ request, response }: HttpContext) {
    try {
      const id = request.param('id');

      await this.jobTitleService.deleteJobTitle(id);

      return genericResponse({
        request,
        response,
        data: null,
        message: 'Job title deleted successfully',
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

  public async fetchJobTitles({ params, request, response }: HttpContext) {
    try {
      const { business_id } = params;
      const { job_title_id } = request.qs();
      await jobTitleValidator.fire({ business_id, job_title_id }, 'fetch');
      const jobTitles = await this.jobTitleService.fetchJobTitles(
        business_id,
        job_title_id
      );
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(JSON.parse(JSON.stringify(jobTitles)), {
          deep: true,
        }),
        message: job_title_id
          ? 'Job title fetched successfully'
          : 'Job titles fetched successfully',
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
}
