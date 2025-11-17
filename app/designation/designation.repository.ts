import Designation from './designation.model.js';

export default class DesignationRepository {

  async findById(id: string): Promise<Designation | null> {
    const query = Designation.query();
    return query.where('id', id).first();
  }

  async findAll(): Promise<Designation[]> {
    return Designation.query().orderBy('designation', 'asc');
  }

} 