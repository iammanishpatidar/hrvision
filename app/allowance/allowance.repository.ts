import Allowance from './allowance.model.js';

export default class AllowanceRepository {
  async create(payload: Partial<Allowance>): Promise<Allowance> {
    return Allowance.create(payload);
  }

  async findById(id: string): Promise<Allowance | null> {
    return Allowance.find(id);
  }

  async update(
    id: string,
    payload: Partial<Allowance>
  ): Promise<Allowance | null> {
    return (await this.findById(id))?.merge(payload).save() ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return (
      (await Allowance.find(id))
        ?.delete()
        .then(() => true)
        .catch(() => false) ?? false
    );
  }

  async findByField(
    field: string,
    value: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Allowance[];
    meta: { total: number; page: number; limit: number };
  }> {
    const baseQuery = Allowance.query().where(field, value);
    const [{ $extras }] = await Allowance.query()
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
