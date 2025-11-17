import Department from './department.model.js';

export default class DepartmentRepository {
  async getById(id: string): Promise<Department | null> {
    return await Department.find(id);
  }

  // Fetch all departments
  async findAll(): Promise<Department[]> {
    return await Department.all();
  }
}
