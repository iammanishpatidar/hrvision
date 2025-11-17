import Business from './business.model.js';

export default class BusinessRepository {
  async create(data: Partial<Business>, trx: any): Promise<Business> {
    return Business.create(data, { client: trx });
  }

  async findById(id: string, trx?: any): Promise<Business | null> {
    const query = Business.query();
    if (trx) query.useTransaction(trx);
    return query.where('id', id).first();
  }

  async findWithAddressByBusinessId(id: string): Promise<Business | null> {
    const query = Business.query().preload('address');
    return query.where('id', id).first();
  }

  async update(
    id: string,
    data: Partial<Business>,
    trx?: any
  ): Promise<Business | null> {
    const query = Business.query();
    if (trx) query.useTransaction(trx);
    const business = await query.where('id', id).first();
    return business ? await business.merge(data).save() : null;
  }

  async delete(id: string, trx?: any): Promise<boolean> {
    try {
      const query = Business.query();
      if (trx) query.useTransaction(trx);
      const business = await query.where('id', id).first();
      if (!business) return false;
      await business.delete();
      return true;
    } catch {
      return false;
    }
  }

  async paginateWithAddress(
    page = 1,
    limit = 10
  ): Promise<{
    data: Business[];
    meta: { total: number; page: number; limit: number };
  }> {
    const query = Business.query().preload('address');
    const countQuery = Business.query();

    const [paginated, [{ $extras }]] = await Promise.all([
      query.paginate(page, limit),
      countQuery.count('* as total'),
    ]);

    return {
      data: paginated.all(),
      meta: {
        total: Number($extras.total || 0),
        page,
        limit,
      },
    };
  }

  async findByField(
    field?: string,
    value?: string,
    page = 1,
    limit = 10
  ): Promise<{
    data: Business[];
    meta: { total: number; page: number; limit: number };
  }> {
    const query = Business.query();
    const countQuery = Business.query();

    if (field && value) {
      query.where(field, value);
      countQuery.where(field, value);
    }

    const [paginated, [{ $extras }]] = await Promise.all([
      query.paginate(page, limit),
      countQuery.count('* as total'),
    ]);

    return {
      data: paginated.all(),
      meta: {
        total: Number($extras.total || 0),
        page,
        limit,
      },
    };
  }

  async findByFields(
    fields: Partial<Record<keyof Business, string>>,
    trx?: any
  ): Promise<Business | null> {
    const query = Business.query();
    if (trx) query.useTransaction(trx);

    Object.entries(fields).forEach(([field, value]) => {
      if (value) {
        query.orWhere(field, value);
      }
    });

    return query.first();
  }
}
