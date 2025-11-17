import CustomError from '../../utilities/custom_error.js';
import EmergencyContact from './emergency_contacts.model.js';
import EmergencyContactRepository from './emergency_contacts.repository.js';
import emergencyContactValidator from './emergency_contacts.validator.js';

export default class EmergencyContactService  {
  private repository: EmergencyContactRepository;

  constructor() {
    this.repository = new EmergencyContactRepository();
  }

  async updateContact(
    id: string,
    payload: Partial<EmergencyContact>,
    trx?: any
  ): Promise<EmergencyContact | null> {
    const contact = await this.repository.findById(id, trx);
    if (!contact) {
      throw new CustomError('Emergency contact not found', 400);
    }
    return await this.repository.update(id, payload, trx);
  }

  async getContactById(id: string, trx?: any): Promise<EmergencyContact> {
    await emergencyContactValidator.validateId(id);
    const contact = await this.repository.findById(id, trx);
    if (!contact) {
      throw new CustomError('Emergency contact not found', 400);
    }
    return contact;
  }

  async createContact(
    payload: Partial<EmergencyContact>,
    trx: any
  ): Promise<EmergencyContact> {
    await emergencyContactValidator.fire(payload, 'create');
    return await this.repository.create(payload, trx);
  }

  async deleteContact(id: string, trx: any): Promise<boolean> {
    const deleted = await this.repository.softDelete(id, trx);
    if (!deleted) {
      throw new CustomError(
        'Emergency contact not found or already deleted',
        400
      );
    }
    return true;
  }

  async getContactsByEmployeeId(
    employeeId: string,
    trx?: any
  ): Promise<EmergencyContact[]> {
    return await this.repository.findByEmployeeId(employeeId, trx);
  }
}
