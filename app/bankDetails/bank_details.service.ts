import CustomError from '../../utilities/custom_error.js';
import BankDetail from './bank_details.model.js';
import BankDetailRepository from './bank_details.repository.js';
import EmployeeRepository from '../employee/employee.repository.js';

export default class BankDetailService {
  private repository: BankDetailRepository;
  private employeeRepository: EmployeeRepository;
  constructor() {
    this.repository = new BankDetailRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  async createBankDetail(payload: Partial<BankDetail>): Promise<BankDetail> {
    if (!payload.employee_id) {
      throw new CustomError('Employee ID is required', 400);
    }
    const employee = await this.employeeRepository.findById(
      payload.employee_id
    );
    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }
    const existingDetail = await this.repository.findByEmployeeId(
      payload.employee_id
    );
    if (existingDetail) {
      throw new CustomError(
        'Bank detail already exists for this employee',
        400
      );
    }
    const bankDetail = await this.repository.create(payload);
    return bankDetail;
  }

  async updateBankDetail(
    id: string,
    payload: Partial<BankDetail>
  ): Promise<BankDetail> {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new CustomError('Bank detail not found', 400);
    }
    return updated;
  }

  async deleteBankDetail(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new CustomError('Bank detail not found', 400);
    }
    return true;
  }

  async fetchBankDetailsByEmployeeId(employee_id: string): Promise<BankDetail> {
    const detail = await this.repository.findByEmployeeId(employee_id);
    if (!detail) {
      throw new CustomError('Bank detail not found', 400);
    }
    return detail;
  }
}
