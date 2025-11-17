import { HttpContext } from '@adonisjs/core/http';
import ContractService from './contract.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import { contractValidator } from './contract.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class ContractController {
  private contractService: ContractService;

  constructor() {
    this.contractService = new ContractService();
  }

  public async createContract({ request, response }: HttpContext) {
    try {
      const payload = request.all();
     
      
      await contractValidator.fire(payload, 'create');

      const newContract = await this.contractService.createContract(payload)

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(newContract.toJSON(), { deep: true }),
        message: 'Contract created successfully',
      })
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message || error.errorMessage,
        error.statusCode || 500,
        error
      )
    }
  }

  public async fetchContractsByBusiness({ request, response }: HttpContext) {
    try {
      const { businessId } = request.params()

      const contracts = await this.contractService.fetchContractsByBusiness(businessId)

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(contracts.map(c => c.toJSON()), { deep: true }),
        message: 'Contracts fetched successfully',
      })
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message || error.errorMessage,
        error.statusCode || 500,
        error
      )
    }
  }

  public async fetchContractById({ request, response }: HttpContext) {
    try {
      const { id } = request.params()

      await contractValidator.validateId(id)

      const contract = await this.contractService.fetchContractById(id)

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(contract.toJSON(), { deep: true }),
        message: 'Contract fetched successfully',
      })
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message || error.errorMessage,
        error.statusCode || 500,
        error
      )
    }
  }

  public async updateContract({ request, response }: HttpContext) {
    try {
      const { id } = request.params()
      const payload = request.all()

      await contractValidator.fire(payload, 'update')

      const updatedContract = await this.contractService.updateContract(id, payload)

      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ updated_contract: updatedContract.toJSON() }, { deep: true }),
        message: 'Contract updated successfully',
      })
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message || error.errorMessage,
        error.statusCode || 500,
        error
      )
    }
  }

  public async deleteContract({ request, response }: HttpContext) {
    try {
      const { id } = request.params()

      await contractValidator.fire({ id }, 'delete')

     const deleted = await this.contractService.deleteContract(id)

      return genericResponse({
        request,
        response,
        data: deleted,        
        message: 'Contract deleted successfully',
      })
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message || error.errorMessage,
        error.statusCode || 500,
        error
      )
    }
  }
}