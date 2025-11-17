import CustomError from '../../utilities/custom_error.js';
import Reimbursement from './reimbursement.model.js';
import ReimbursementRepository from './reimbursements.repository.js';
import EmployeeRepository from '../employee/employee.repository.js';

export default class ReimbursementService {
  private repository: ReimbursementRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.repository = new ReimbursementRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  async createReimbursement(
    payload: Partial<Reimbursement>
  ): Promise<Reimbursement> {
    if (!payload.employee_id) {
      throw new CustomError('Employee ID is required', 400);
    }
    const employee = await this.employeeRepository.findById(
      payload.employee_id
    );
    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }
    const reimbursement = await this.repository.create(payload);
    return reimbursement;
  }

  async updateReimbursement(
    id: string,
    payload: Partial<Reimbursement>
  ): Promise<Reimbursement> {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new CustomError('Reimbursement not found', 400);
    }
    return updated;
  }

  async deleteReimbursement(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new CustomError('Reimbursement not found', 400);
    }
    return true;
  }

  async fetchReimbursementsByEmployeeId(
    employee_id: string
  ): Promise<Reimbursement[]> {
    const reimbursements = await this.repository.findByEmployeeId(employee_id);
    if (!reimbursements) {
      throw new CustomError('No reimbursements found for this employee', 400);
    }
    return reimbursements;
  }

  //   async fetchReimbursementsByBusinessId(
  //     business_id: string,
  //     page: number = 1,
  //     limit: number = 10
  //   ): Promise<{
  //     data: Reimbursement[]
  //     meta: { total: number; page: number; limit: number }
  //   }> {
  //     const result = await this.repository.findByField('business_id', business_id, page, limit)
  //     if (!result.data.length) {
  //       throw new CustomError('No reimbursements found for this business', 400)
  //     }
  //     return result
  //   }

  async fetchReimbursementById(id: string): Promise<Reimbursement> {
    const reimbursement = await this.repository.findById(id);
    if (!reimbursement) {
      throw new CustomError('Reimbursement not found', 400);
    }
    return reimbursement;
  }
}
