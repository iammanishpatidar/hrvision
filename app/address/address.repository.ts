import Address from './address.model.js';

export default class AddressRepository {
  async create(data: Partial<Address>, trx: any): Promise<Address> {
    return await Address.create(data, { client: trx });
  }

  async update(
    id: string,
    data: Partial<Address>,
    trx?: any
  ): Promise<Address | null> {
    const address = await Address.find(id, { client: trx });
    if (!address) return null;

    address.merge(data);
    await address.useTransaction(trx).save();

    return address;
  }
  async findById(id: string, trx?: any): Promise<Address | null> {
    return await Address.find(id, { client: trx });
  }
}
