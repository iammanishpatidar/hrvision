import { HttpContext } from '@adonisjs/core/http';
import BankDetailService from './bank_details.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import bankDetailValidator from './bank_details.validator.js';

export default class BankDetailController {
  private bankDetailService: BankDetailService;

  constructor() {
    this.bankDetailService = new BankDetailService();
  }

  public async createBankDetail({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await bankDetailValidator.fire(payload, 'create');
      const bankDetail = await this.bankDetailService.createBankDetail(payload);
      return genericResponse({
        request,
        response,
        data: bankDetail,
        message: 'Bank detail created successfully',
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

  public async updateBankDetail({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await bankDetailValidator.fire(payload, 'update');
      const bankDetail = await this.bankDetailService.updateBankDetail(
        request.param('id'),
        payload
      );
      return genericResponse({
        request,
        response,
        data: bankDetail,
        message: 'Bank detail updated successfully',
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

  public async deleteBankDetail({ request, response }: HttpContext) {
    try {
      const deleted = await this.bankDetailService.deleteBankDetail(
        request.param('id')
      );
      return genericResponse({
        request,
        response,
        data: deleted,
        message: 'Bank detail deleted successfully',
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

  public async fetchBankDetailByEmployeeId({ request, response }: HttpContext) {
    try {
      const employeeId = request.qs().employee_id;
      const detail =
        await this.bankDetailService.fetchBankDetailsByEmployeeId(employeeId);
      return genericResponse({
        request,
        response,
        data: detail,
        message: 'Bank detail fetched successfully',
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
