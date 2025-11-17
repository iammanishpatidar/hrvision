import CustomError from '../../utilities/custom_error.js';
import Address from './address.model.js';
import AddressRepository from './address.repository.js';
import addressValidator from './address.validator.js';

export default class AddressService {
  private repository: AddressRepository;

  constructor() {
    this.repository = new AddressRepository();
  }

  async createAddress(payload: Partial<Address>, trx: any): Promise<Address> {
    await addressValidator.fire(payload, 'create');
    return await this.repository.create(payload, trx);
  }

  async updateAddress(
    id: string,
    payload: Partial<Address>,
    trx?: any
  ): Promise<Address | null> {
    const address = await this.repository.findById(id, trx);
    if (!address) {
      throw new CustomError('Address not found', 400);
    }
    return await this.repository.update(id, payload, trx);
  }

  async getAddressById(id: string, trx?: any): Promise<Address> {
    await addressValidator.validateId(id);
    const address = await this.repository.findById(id, trx);
    if (!address) {
      throw new CustomError('Address not found', 400);
    }
    return address;
  }
}
