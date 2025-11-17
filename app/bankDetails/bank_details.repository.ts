import BankDetail from './bank_details.model.js';

export default class BankDetailRepository {
  async create(payload: Partial<BankDetail>): Promise<BankDetail> {
    return BankDetail.create(payload);
  }

  async findById(id: string): Promise<BankDetail | null> {
    return BankDetail.find(id);
  }

  async update(
    id: string,
    payload: Partial<BankDetail>
  ): Promise<BankDetail | null> {
    const record = await this.findById(id);
    if (!record) return null;
    return record.merge(payload).save();
  }

  async delete(id: string): Promise<boolean> {
    const record = await BankDetail.find(id);
    if (!record) return false;

    try {
      await record.delete();
      return true;
    } catch {
      return false;
    }
  }

  async findByEmployeeId(employeeId: string): Promise<BankDetail | null> {
    return BankDetail.query().where('employee_id', employeeId).first();
  }

  //   async findByField(
  //     field: keyof BankDetail,
  //     value: string | number,
  //     page: number = 1,
  //     limit: number = 10
  //   ): Promise<{
  //     data: BankDetail[];
  //     meta: { total: number; page: number; limit: number };
  //   }> {
  //     const baseQuery = BankDetail.query().where(field, value);
  //     const [{ $extras }] = await BankDetail.query()
  //       .where(field, value)
  //       .count('* as total');
  //     const data = await baseQuery.paginate(page, limit);

  //     return {
  //       data: data.all(),
  //       meta: {
  //         total: Number($extras.total || 0),
  //         page,
  //         limit,
  //       },
  //     };
  //   }
}
