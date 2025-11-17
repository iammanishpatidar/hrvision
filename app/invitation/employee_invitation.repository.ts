import EmployeeInvitation from './employee_invitation.model.js';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';

export default class EmployeeInvitationRepository {
  async create(data: Partial<EmployeeInvitation>, trx?: any): Promise<EmployeeInvitation> {
    return await EmployeeInvitation.create(data, trx ? { client: trx } : {});
  }

  async findById(id: string): Promise<EmployeeInvitation | null> {
    return await EmployeeInvitation.find(id);
  }

  async findByToken(token: string): Promise<EmployeeInvitation | null> {
    return await EmployeeInvitation.query()
      .where('token', token)
      .first();
  }

  async findByEmail(
    email: string,
    businessId?: string
  ): Promise<EmployeeInvitation | null> {
    const query = EmployeeInvitation.query()
      .preload('employee')
      .whereHas('employee', (employeeQuery) => {
        employeeQuery.where('email', email);
        if (businessId) {
          employeeQuery.andWhere('business_id', businessId);
        }
      });

    return await query.first();
  }

  async update(id: string, data: Partial<EmployeeInvitation>): Promise<EmployeeInvitation | null> {
    const invitation = await EmployeeInvitation.find(id);
    if (!invitation) {
      return null;
    }

    invitation.merge(data);
    await invitation.save();
    return invitation;
  }

  async delete(id: string): Promise<boolean> {
    const invitation = await EmployeeInvitation.find(id);
    if (!invitation) {
      return false;
    }

    await invitation.delete();
    return true;
  }

  async findByBusiness(
    businessId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ModelPaginatorContract<EmployeeInvitation>> {
    return await EmployeeInvitation.query()
      .preload('employee', (employeeQuery) => {
        employeeQuery
          .preload('business')
          .preload('department')
          .preload('role');
      })
      .preload('admin', (adminQuery) => {
        adminQuery.preload('business').preload('department');
      })
      .whereHas('employee', (employeeQuery) => {
        employeeQuery.where('business_id', businessId);
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit);
  }

  async findByStatus(
    businessId: string,
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    return await EmployeeInvitation.query()
      .preload('employee', (employeeQuery) => {
        employeeQuery
          .preload('business')
          .preload('department')
          .preload('role');
      })
      .preload('admin', (adminQuery) => {
        adminQuery.preload('business').preload('department');
      })
      .where('status', status)
      .whereHas('employee', (employeeQuery) => {
        employeeQuery.where('business_id', businessId);
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit);
  }

  async findExpiredInvitations(): Promise<EmployeeInvitation[]> {
    return await EmployeeInvitation.query()
      .where('expires_at', '<', new Date())
      .whereNot('status', 'EXPIRED')
      .exec();
  }
}
