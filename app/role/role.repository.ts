import Role from './role.model.js';

export default class RoleRepository {
  async findByRole(role: string, trx?: any): Promise<Role | null> {
    const query = Role.query().where('role', role);
    if (trx) {
      query.useTransaction(trx);
    }
    return query.first();
  }

  async findAll(): Promise<Role[]> {
    return Role.query().whereNull('deleted_at').orderBy('role', 'asc');
  }

  async findById(id: string): Promise<Role | null> {
    return Role.query().where('id', id).whereNull('deleted_at').first();
  }
}
