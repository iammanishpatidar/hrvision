import Employee from './employee.model.js';

export default class EmployeeRepository {
  async getAllEmployeesFilter({
    limit,
    offset,
    domain,
    query,
    businessId,
  }: {
    limit: number;
    offset: number;
    domain?: string;
    query?: string;
    businessId: string;
  }) {
    const employeesQuery = Employee.query()
      .where('business_id', businessId)
      .offset(offset)
      .limit(limit);

    if (query) {
      employeesQuery.where((queryBuilder) => {
        queryBuilder
          .whereILike('name', `%${query}%`)
          .orWhereILike('email', `%${query}%`)
          .orWhereILike('contact_number', `%${query}%`);
      });
    }

    if (domain) {
      employeesQuery.where('domain', domain);
    }

    return await employeesQuery;
  }

  async findAll(): Promise<Employee[]> {
    return await Employee.all();
  }

  async findById(id: string, trx?: any): Promise<Employee | null> {
    const query = Employee.query();
    if (trx) query.useTransaction(trx);
    
    // Check if id is a valid UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      // If it's a UUID, search by id field
      return query.where('id', id).first();
    } else {
      // If it's not a UUID, search by clerk_id field
      return query.where('clerk_id', id).first();
    }
  }

  async fetchEmployeeById(id: string): Promise<Employee | null> {
    // Check if id is a valid UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    const query = Employee.query();
    
    if (isUUID) {
      // If it's a UUID, search by id field
      query.where('id', id);
    } else {
      // If it's not a UUID, search by clerk_id field
      query.where('clerk_id', id);
    }
    
    return await query
      .preload('permanentAddress')
      .preload('currentAddress')
      .preload('department')
      .preload('role')
      .preload('location')
      .preload('business')
      .preload('emergencyContact', (query) => {
        query.preload('address');
      })
      .preload('manager')
      .first();
  }

  async create(data: Partial<Employee>, trx: any): Promise<Employee> {
    return await Employee.create(data, { client: trx });
  }
  async delete(id: string): Promise<boolean> {
    return (
      (await Employee.find(id))
        ?.delete()
        .then(() => true)
        .catch(() => false) ?? false
    );
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return await Employee.query().where('email', email).first();
  }
  async findByClerkId(clerkId: string): Promise<Employee | null> {
    return await Employee.query().where('clerk_id', clerkId).first();
  }
  async update(
    id: string,
    data: Partial<Employee>,
    trx?: any
  ): Promise<Employee | null> {
    const employee = await Employee.query().where('id', id).first();
    employee?.useTransaction(trx);
    return employee ? await employee.merge(data).save() : null;
  }
}
