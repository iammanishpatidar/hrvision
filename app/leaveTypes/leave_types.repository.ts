import LeaveTypes from './leave_types.model.js';
import { DateTime } from 'luxon';

export default class LeaveTypesRepository {
  async create(data: Partial<LeaveTypes>): Promise<LeaveTypes> {
    return await LeaveTypes.create(data);
  }

  async update(
    id: string,
    data: Partial<LeaveTypes>
  ): Promise<LeaveTypes | null> {
    await LeaveTypes.query().where('id', id).update(data);
    return await LeaveTypes.query().where('id', id).first();
  }

  async findById(id: string) {
    return await LeaveTypes.query().where('id', id).first();
  }

  async findLeaveTypes(
    id?: string,
    businessId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: LeaveTypes[];
    meta: { total: number; page: number; limit: number };
  }> {
    // Create base query conditions
    const baseQuery = () => {
      const query = LeaveTypes.query();
      if (id) {
        query.where('id', id);
      }
      if (businessId) {
        query.where('business_id', businessId);
      }
      return query;
    };

    // Get count with separate query
    const countQuery = baseQuery();
    const [{ $extras }] = await countQuery.count('* as total');

    // Get data with separate query
    const dataQuery = baseQuery();
    const data = await dataQuery.paginate(page, limit);

    return {
      data: data.all(),
      meta: {
        total: Number($extras.total || 0),
        page,
        limit,
      },
    };
  }

  async delete(deleteLeave: LeaveTypes): Promise<void> {
    deleteLeave.deletedAt = DateTime.now();
    await deleteLeave.save();
  }
}
