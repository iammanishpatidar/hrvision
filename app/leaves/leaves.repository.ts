import { DateTime } from 'luxon';
import Leaves from './leaves.model.js';

interface LeavesFilters {
  date?: string;
  leaveType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export default class LeavesRepository {
  async findAll(): Promise<Leaves[]> {
    return await Leaves.all();
  }

  async findByEmployeeId(
    employeeId: string,
    filters?: LeavesFilters
  ): Promise<{
    data: Leaves[];
    meta: { total: number; page: number; limit: number };
  }> {
    let query = Leaves.query().where('employee_id', employeeId);

    // Apply filters if they exist
    if (filters) {
      if (filters.leaveType) {
        // Join with leave_types table to filter by leave type name
        query = query
          .join('leave_types', 'leaves.leave_type_id', 'leave_types.id')
          .where('leave_types.name', filters.leaveType);
      }

      if (filters.status) {
        query = query.where('status', filters.status);
      }

      if (filters.date) {
        try {
          const startDate = DateTime.fromISO(filters.date).startOf('day');
          if (startDate.isValid) {
            query = query.where('date', '>=', startDate.toSQLDate());
          }
        } catch (error) {
          console.error('Invalid startDate format', error);
        }
      }
    }

    // Get total count
    const countQuery = query.clone();
    const totalResult = await countQuery.count('* as total');
    const total = Number(totalResult[0].$extras.total);

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    query = query.offset(offset).limit(limit);

    // Load relations
    query = query.preload('leaveTypes');

    const data = await query.exec();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findById(id: string): Promise<Leaves | null> {
    return await Leaves.query().where('id', id).preload('leaveTypes').first();
  }

  async findByIdAndEmployeeId(
    id: string,
    employeeId: string
  ): Promise<Leaves | null> {
    return await Leaves.query()
      .where('id', id)
      .where('employee_id', employeeId)
      .preload('leaveTypes')
      .first();
  }

  async create(data: Partial<Leaves>): Promise<Leaves> {
    return await Leaves.create(data);
  }

  async update(id: string, data: Partial<Leaves>): Promise<Leaves | null> {
    const leaves = await Leaves.find(id);
    if (!leaves) return null;

    leaves.merge(data);
    await leaves.save();
    return leaves;
  }

  async updateStatus(id: string, status: string): Promise<Leaves | null> {
    const leaves = await Leaves.find(id);
    if (!leaves) return null;

    leaves.status = status;
    await leaves.save();
    return leaves;
  }

  async delete(id: string): Promise<boolean> {
    const leaves = await Leaves.find(id);
    if (!leaves) return false;

    await leaves.delete();
    return true;
  }

  async findByBusinessId(
    businessId: string,
    filters?: LeavesFilters
  ): Promise<{
    data: Leaves[];
    meta: { total: number; page: number; limit: number };
  }> {
    let query = Leaves.query().where('leaves.business_id', businessId);

    // Apply filters if they exist
    if (filters) {
      if (filters.leaveType) {
        // Join with leave_types table to filter by leave type name
        query = query
          .join('leave_types', 'leaves.leave_type_id', 'leave_types.id')
          .where('leave_types.id', filters.leaveType);
      }

      if (filters.status) {
        query = query.where('leaves.status', filters.status);
      }

      if (filters.date) {
        try {
          const startDate = DateTime.fromISO(filters.date).startOf('day');
          if (startDate.isValid) {
            query = query.where('leaves.date', '>=', startDate.toSQLDate());
          }
        } catch (error) {
          console.error('Invalid startDate format', error);
        }
      }
    }

    // Explicitly filter out soft-deleted leaves (fully qualified)
    query = query.whereNull('leaves.deleted_at');

    // Get total count
    const countQuery = query.clone();
    const totalResult = await countQuery.count('* as total');
    const total = Number(totalResult[0].$extras.total);

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    query = query.offset(offset).limit(limit);

    // Load relations
    query = query.preload('leaveTypes').preload('employee');

    const data = await query.exec();

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
