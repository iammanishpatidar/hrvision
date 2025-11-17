import { HttpContext } from '@adonisjs/core/http';
import CompanyPolicyService from './policy.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import snakecaseKeys from 'snakecase-keys';
import CompanyPolicyValidator from './policy.validator.js';

export default class CompanyPolicyController {
  private companyPolicyService: CompanyPolicyService;

  constructor() {
    this.companyPolicyService = new CompanyPolicyService();
  }

  public async createCompanyPolicy({ request, response }: HttpContext) {
    try {
      const file = request.file('file_path', {
        size: '8mb',
        extnames: ['pdf', 'doc', 'docx'],
      });

      const payload = request.only([
        'policy_name',
        'description',
        'business_id',
      ]);
      await CompanyPolicyValidator.fire(payload, 'create');

      const created = await this.companyPolicyService.create(file, payload);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(created.toJSON(), { deep: true }),
        message: 'Company policy created successfully',
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

  public async updateCompanyPolicy({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      const businessId = request.qs().businessId;
      const payload = request.all();

      await CompanyPolicyValidator.fire(payload, 'update');

      const updated = await this.companyPolicyService.update(
        id,
        businessId,
        payload
      );

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(updated.toJSON(), { deep: true }),
        message: 'Company policy updated successfully',
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
  public async getPoliciesByBusiness({ request, response }: HttpContext) {
    try {
      const { businessId } = request.params();

      const policies =
        await this.companyPolicyService.getByBusinessId(businessId);
      await CompanyPolicyValidator.fire(policies, 'get');

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          policies.map((p) => p.toJSON()),
          { deep: true }
        ),
        message: 'Company policies fetched successfully',
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

  public async getAllPolicies({ request, response }: HttpContext) {
    try {
      const policies = await this.companyPolicyService.listAll();

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          policies.map((p) => p.toJSON()),
          { deep: true }
        ),
        message: 'All company policies fetched successfully',
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
