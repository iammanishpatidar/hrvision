import CustomError from '../../utilities/custom_error.js';
import DepartmentRepository from './department.repository.js';
import departmentValidator from './department.validator.js';

export default class DepartmentService {
  private repository: DepartmentRepository;
  constructor() {
    this.repository = new DepartmentRepository();
  }

  async fetchDepartmentById(id: string) {
    console.log('Department ID received:', id, 'Type:', typeof id);
    await departmentValidator.validateId(id);
    const department = await this.repository.getById(id);
    if (!department) {
      throw new CustomError('Department not found!', 400);
    }
    return department;
  }

  async fetchAllDepartments() {
    const departments = await this.repository.findAll();
    return departments;
  }
}
