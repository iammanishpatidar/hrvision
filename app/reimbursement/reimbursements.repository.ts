import Reimbursement from './reimbursement.model.js';

export default class ReimbursementRepository {
  async create(payload: Partial<Reimbursement>): Promise<Reimbursement> {
    return Reimbursement.create(payload);
  }

  async findById(id: string): Promise<Reimbursement | null> {
    return Reimbursement.find(id);
  }

  async update(
    id: string,
    payload: Partial<Reimbursement>
  ): Promise<Reimbursement | null> {
    const record = await this.findById(id);
    if (!record) return null;
    return record.merge(payload).save();
  }

  async delete(id: string): Promise<boolean> {
    const record = await Reimbursement.find(id);
    if (!record) return false;

    try {
      await record.delete();
      return true;
    } catch {
      return false;
    }
  }

  async findByEmployeeId(employeeId: string): Promise<Reimbursement[] | null> {
    const result = await Reimbursement.query().where('employee_id', employeeId);
    return result.length > 0 ? result : null;
  }

  async findByField(
    field: keyof Reimbursement,
    value: string | number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Reimbursement[];
    meta: { total: number; page: number; limit: number };
  }> {
    const baseQuery = Reimbursement.query().where(field, value);
    const [{ $extras }] = await Reimbursement.query()
      .where(field, value)
      .count('* as total');
    const data = await baseQuery.paginate(page, limit);

    return {
      data: data.all(),
      meta: {
        total: Number($extras.total || 0),
        page,
        limit,
      },
    };
  }
}
