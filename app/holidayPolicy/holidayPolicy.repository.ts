import HolidayLeavePolicy from './holidayPolicy.model.js';

export default class HolidayLeavePolicyRepository {
  async create(
    payload: Partial<HolidayLeavePolicy>
  ): Promise<HolidayLeavePolicy> {
    return HolidayLeavePolicy.create(payload);
  }

  async findById(id: string): Promise<HolidayLeavePolicy | null> {
    return HolidayLeavePolicy.find(id);
  }

  async update(
    id: string,
    payload: Partial<HolidayLeavePolicy>
  ): Promise<HolidayLeavePolicy | null> {
    const record = await this.findById(id);
    if (!record) return null;
    return record.merge(payload).save();
  }

  async delete(id: string): Promise<boolean> {
    const record = await this.findById(id);
    if (!record) return false;

    try {
      await record.delete();
      return true;
    } catch {
      return false;
    }
  }

  async findByBusinessId(
    businessId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: HolidayLeavePolicy[];
    meta: { total: number; page: number; limit: number };
  }> {
    const baseQuery = HolidayLeavePolicy.query().where(
      'business_id',
      businessId
    );

    const totalQuery = await HolidayLeavePolicy.query()
      .where('business_id', businessId)
      .count('* as total');
    const total = Number(totalQuery[0].$extras.total);

    const paginated = await baseQuery.paginate(page, limit);

    return {
      data: paginated.all(),
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findByBusinessAndDate(
    businessId: string,
    date: string
  ): Promise<HolidayLeavePolicy | null> {
    return HolidayLeavePolicy.query()
      .where('business_id', businessId)
      .where('date', date)
      .first();
  }

  async findByBusinessAndName(
    businessId: string,
    name: string
  ): Promise<HolidayLeavePolicy | null> {
    return HolidayLeavePolicy.query()
      .where('business_id', businessId)
      .where('name', name)
      .first();
  }

  async findByField(
    field: keyof HolidayLeavePolicy,
    value: string | number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: HolidayLeavePolicy[];
    meta: { total: number; page: number; limit: number };
  }> {
    const baseQuery = HolidayLeavePolicy.query().where(field, value);
    const [{ $extras }] = await HolidayLeavePolicy.query()
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
