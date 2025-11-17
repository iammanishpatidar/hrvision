import allowanceValidator from './allowance.validator.js';
import CustomError from '../../utilities/custom_error.js';
import Allowance from './allowance.model.js';
import AllowanceRepository from './allowance.repository.js';

export default class AllowanceService {
  private repository: AllowanceRepository;

  constructor() {
    this.repository = new AllowanceRepository();
  }

  async createAllowance(payload: Partial<Allowance>): Promise<Allowance> {
    await allowanceValidator.fire(payload, 'create');
    const allowance = await this.repository.create(payload);
    return allowance;
  }

  async updateAllowance(
    id: string,
    payload: Partial<Allowance>
  ): Promise<Allowance> {
    await allowanceValidator.validateId(id);
    await allowanceValidator.fire(payload, 'update');

    const updatedAllowance = await this.repository.update(id, payload);
    if (!updatedAllowance) {
      throw new CustomError('Allowance not found', 400);
    }
    return updatedAllowance;
  }

  async deleteAllowance(id: string): Promise<boolean> {
    await allowanceValidator.validateId(id);
    const deletedAllowance = await this.repository.delete(id);
    if (!deletedAllowance) {
      throw new CustomError('Allowance not found', 400);
    }
    return true;
  }

  async fetchAllowanceById(id: string): Promise<Allowance> {
    await allowanceValidator.validateId(id);
    const allowance = await this.repository.findById(id);
    if (!allowance) {
      throw new CustomError('Allowance not found', 400);
    }
    return allowance;
  }

  async fetchAllowancesByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Allowance[];
    meta: { total: number; page: number; limit: number };
  }> {
    await allowanceValidator.validateId(businessId);
    const allowances = await this.repository.findByField(
      'business_id',
      businessId,
      page,
      limit
    );

    if (!allowances.data.length) {
      throw new CustomError(
        'No allowances found for the given business ID',
        400
      );
    }

    return allowances;
  }
}
