import Bonus from './bonus.model.js';

export default class BonusRepository {
  async create(payload: Partial<Bonus>): Promise<Bonus> {
    return Bonus.create(payload);
  }

  async findById(id: string): Promise<Bonus | null> {
    return Bonus.find(id);
  }

  async update(id: string, payload: Partial<Bonus>): Promise<Bonus | null> {
    return (await this.findById(id))?.merge(payload).save() ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return (
      (await Bonus.find(id))
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
    data: Bonus[];
    meta: { total: number; page: number; limit: number };
  }> {
    const baseQuery = Bonus.query().where(field, value);
    const [{ $extras }] = await Bonus.query()
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
