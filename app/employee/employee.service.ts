import EmployeeRepository from './employee.repository.js';
import Employee from './employee.model.js';
import employeeValidator from './employee.validator.js';
import CustomError from '../../utilities/custom_error.js';
import db from '@adonisjs/lucid/services/db';
import Business from '#app/business/business.model';


export default class EmployeeService {
  private repository: EmployeeRepository;

  constructor() {
    this.repository = new EmployeeRepository();
  }

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    await employeeValidator.fire(data, 'create');
    return await this.repository.create(data, '');
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.repository.findAll();
  }

  public async fetchEmployee(id: string): Promise<Employee> {
    const employee = await this.repository.fetchEmployeeById(id);
    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }
    return employee;
  }

  async updateEmployee(
    employee_id: string,
    data: Partial<any>
  ): Promise<Employee | null> {
    const trx = await db.transaction();
    try {
      const existingEmployee = await this.repository.findById(employee_id, trx);
      if (!existingEmployee) {
        throw new CustomError('Employee not found', 400);
      }
      const updatedEmployee = await this.repository.update(
        employee_id,
        data,
        trx
      );
      await trx.commit();
      return updatedEmployee;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async deleteEmployee(employee_id: string): Promise<boolean> {
    await employeeValidator.fire({ id: employee_id }, 'delete');
    const deletedEmployee = await this.repository.delete(employee_id);
    if (!deletedEmployee) {
      throw new CustomError('Employee not found', 400);
    }
    return true;
  }

  public async fetchEmployeesByBusiness(
    businessId: string
  ): Promise<Employee[]> {
    if (!businessId) {
      throw new CustomError('Business ID is required', 400);
    }
    const findBusiness=await Business.find(businessId);
    if(!findBusiness)
    {
      throw new CustomError('Business not found',400);
    }

    try {
      const employees = await Employee.query()
        .where('business_id', businessId)
        .preload('permanentAddress')
        .preload('currentAddress')
        .preload('department')
        .preload('role')
        .preload('location')
        .preload('business')
        .preload('emergencyContact', (query) => {
          query.preload('address');
        })
        .preload('manager');

      return employees;
    } catch (error) {
      throw error;
    }
  }
}
