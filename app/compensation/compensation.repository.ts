import Compensation from './compensation.model.js';

export default class CompensationRepository {
  async create(
    data: Partial<Compensation>
  ): Promise<Compensation> {
    return await Compensation.create(data);
  }

  async getAll(): Promise<Compensation[]> {
    return await Compensation.all();
  }

  async getByEmployeeId(employeeId: string): Promise<Compensation[]> {
    return await Compensation.query().where('employee_id', employeeId);
  }

  async get(id: string): Promise<Compensation | null> {
    return await Compensation.find(id);
  }

  async update(
    id: string,
    data: Partial<Compensation>
  ): Promise<Compensation | null> {
    const compensation = await Compensation.find(id);
    if (!compensation) return null;

    compensation.merge(data);
    await compensation.save();
    return compensation;
  }

  async delete(id: string): Promise<boolean> {
    const compensation = await Compensation.find(id);
    if (!compensation) return false;

    await compensation.delete();
    return true;
  }
}
