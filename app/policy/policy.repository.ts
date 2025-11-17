import CompanyPolicy from './policy.model.js'

export default class CompanyPolicyRepository {
 
  async create(payload: Partial<CompanyPolicy>) {
    return await CompanyPolicy.create(payload)
  }

  
  async findById(id: string) {
    return await CompanyPolicy.find(id)
  }

  
  async findByBusinessId(businessId: string) {
    return await CompanyPolicy.query().where('business_id', businessId)
  }

  
  async update(id: string, payload: Partial<CompanyPolicy>) {
    const policy = await CompanyPolicy.findOrFail(id)
    policy.merge(payload)
    await policy.save()
    return policy
  }

  
  async all() {
    return await CompanyPolicy.all()
  }
}
