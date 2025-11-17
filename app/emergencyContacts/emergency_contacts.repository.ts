import EmergencyContact from './emergency_contacts.model.js';

export default class EmergencyContactRepository {
  async create(
    data: Partial<EmergencyContact>,
    trx: any
  ): Promise<EmergencyContact> {
    return await EmergencyContact.create(data, { client: trx });
  }

  async update(
    id: string,
    data: Partial<EmergencyContact>,
    trx: any
  ): Promise<EmergencyContact | null> {
    const contact = await EmergencyContact.find(id, { client: trx });
    if (!contact) return null;

    contact.merge(data);
    await contact.useTransaction(trx).save();

    return contact;
  }

  async findByEmployeeId(
    employeeId: string,
    trx?: any
  ): Promise<EmergencyContact[]> {
    const query = EmergencyContact.query();

    if (trx) {
      query.useTransaction(trx);
    }

    return await query.where('employee_id', employeeId);
  }

  async softDelete(id: string, trx: any): Promise<boolean> {
    const contact = await EmergencyContact.find(id, { client: trx });
    if (!contact) return false;

    await contact.useTransaction(trx).delete();
    return true;
  }

  async findById(id: string, trx?: any): Promise<EmergencyContact | null> {
    return await EmergencyContact.find(id, { client: trx });
  }
}
