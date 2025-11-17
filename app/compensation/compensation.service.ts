import Compensation from './compensation.model.js';
import CompensationRepository from './compensation.repository.js';
import Employee from '../employee/employee.model.js';
import Allowance from '../allowance/allowance.model.js';
import CustomError from '../../utilities/custom_error.js';
export default class CompensationService {
  private repository: CompensationRepository;

  constructor() {
    this.repository = new CompensationRepository();
  }
  private async calculateTotalAllowance(businessId: string): Promise<number> {
    try {
      const allowances = await Allowance.query()
        .where('business_id', businessId)
        .where('status', 'active')
        .whereNull('deleted_at');
      
      return allowances.reduce((total, allowance) => total + allowance.amount, 0);
    } catch (error) {
      console.warn('Could not fetch allowances for business:', businessId, error);
      return 0;
    }
  }

  async create(
    compensation: Partial<Compensation>
  ): Promise<Compensation> {
    const employee = await Employee.find(compensation.employee_id!);

    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }

    // Check for existing compensation record for this employee
    const existingCompensation = await this.repository.getByEmployeeId(compensation.employee_id!);
    if (existingCompensation && existingCompensation.length > 0) {
      throw new CustomError('Compensation record already exists for this employee. Please update the existing record instead.', 400);
    }

    // Calculate total allowance from business allowances
    const calculatedTotalAllowance = await this.calculateTotalAllowance(employee.business_id);
    
    // Use provided total_allowance if available, otherwise use calculated value
    const finalTotalAllowance = compensation.total_allowance ?? calculatedTotalAllowance;
    
    // Update the compensation object with the final total allowance
    compensation.total_allowance = finalTotalAllowance;
    const result = await this.repository.create(compensation);
    return result;
  }

  async fetchByEmployeeId(employeeId: string): Promise<Compensation[]> {
    const employee = await Employee.find(employeeId);

    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }

    return await this.repository.getByEmployeeId(employeeId);
  }

  async get(id: string): Promise<Compensation> {
    const compensation = await this.repository.get(id);
    if (!compensation) {
      throw new CustomError('Compensation not found', 400);
    }
    return compensation;
  }

  async update(
    id: string,
    data: Partial<Compensation>
  ): Promise<Compensation> {
    const compensation = await this.repository.get(id);
    if (!compensation) {
      throw new CustomError('Compensation not found', 400);
    }

    // Recalculate total_allowance if not provided in update
    if (!data.hasOwnProperty('total_allowance')) {
      const employee = await Employee.find(compensation.employee_id);
      if (employee) {
        const calculatedTotalAllowance = await this.calculateTotalAllowance(employee.business_id);
        data.total_allowance = calculatedTotalAllowance;
      }
    }

    // Recalculate net_salary if base_salary or total_allowance is updated
    if (data.hasOwnProperty('base_salary') || data.hasOwnProperty('total_allowance')) {
      const newBaseSalary = data.base_salary ?? compensation.base_salary;
      const newTotalAllowance = data.total_allowance ?? compensation.total_allowance ?? 0;
      data.net_salary = newBaseSalary + newTotalAllowance;
    }

    const updatedCompensation = await this.repository.update(id, data);
    if (!updatedCompensation) {
      throw new CustomError('Failed to update compensation', 400);
    }
    return updatedCompensation;
  }

  async delete(id: string): Promise<boolean> {
    const compensation = await this.repository.get(id);
    if (!compensation) {
      throw new CustomError('Compensation not found', 400);
    }

    await this.repository.delete(id);
    return true;
  }
}
