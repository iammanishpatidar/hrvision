import { HttpContext } from '@adonisjs/core/http';
import ReimbursementService from './reimbursements.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import reimbursementValidator from './reimbursements.validator.js';

export default class ReimbursementController {
  private reimbursementService: ReimbursementService;

  constructor() {
    this.reimbursementService = new ReimbursementService();
  }

  public async createReimbursement({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await reimbursementValidator.fire(payload, 'create');
      const reimbursement =
        await this.reimbursementService.createReimbursement(payload);
      return genericResponse({
        request,
        response,
        data: reimbursement,
        message: 'Reimbursement created successfully',
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

  public async updateReimbursement({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      const payload = request.all();
      await reimbursementValidator.fire(payload, 'update');
      const reimbursement = await this.reimbursementService.updateReimbursement(
        id,
        payload
      );
      return genericResponse({
        request,
        response,
        data: reimbursement,
        message: 'Reimbursement updated successfully',
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

  public async deleteReimbursement({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      const deleted = await this.reimbursementService.deleteReimbursement(id);
      return genericResponse({
        request,
        response,
        data: deleted,
        message: 'Reimbursement deleted successfully',
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

  public async fetchReimbursementById({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      const reimbursement =
        await this.reimbursementService.fetchReimbursementById(id);
      return genericResponse({
        request,
        response,
        data: reimbursement,
        message: 'Reimbursement fetched successfully',
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

  public async fetchReimbursementsByEmployeeId({
    request,
    response,
  }: HttpContext) {
    try {
      const employeeId = request.param('employeeId');
      const reimbursements =
        await this.reimbursementService.fetchReimbursementsByEmployeeId(
          employeeId
        );
      return genericResponse({
        request,
        response,
        data: reimbursements,
        message: 'Reimbursements fetched successfully',
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

  public async updateReimbursementStatus({ request, response }: HttpContext) {
    try {
      const id = request.param('id');
      const payload = request.all();
      await reimbursementValidator.fire(payload, 'updateStatus');
      const reimbursement = await this.reimbursementService.updateReimbursement(
        id,
        payload
      );
      return genericResponse({
        request,
        response,
        data: reimbursement,
        message: 'Reimbursement status updated successfully',
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

  //   public async fetchReimbursementsByBusinessId({ request, response }: HttpContext) {
  //     try {
  //       const businessId = request.param('businessId')
  //       const page = Number(request.qs().page) || 1
  //       const limit = Number(request.qs().limit) || 10
  //       const result = await this.reimbursementService.fetchReimbursementsByBusinessId(
  //         businessId,
  //         page,
  //         limit
  //       )
  //       return genericResponse({
  //         request,
  //         response,
  //         data: { data: result.data, meta: result.meta },
  //         message: 'Reimbursements fetched successfully',
  //       })
  //     } catch (error) {
  //       const statusCode = error.statusCode || 500
  //       const errorMessage = error.message || error.errorMessage
  //       return commonRequestErrorHandler({ request, response }, errorMessage, statusCode, error)
  //     }
  //   }
}
