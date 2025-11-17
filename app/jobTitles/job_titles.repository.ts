import JobTitle from './job_titles.models.js';

export default class JobTitleRepository {
  async findById(id: string): Promise<JobTitle | null> {
    const query = JobTitle.query();
    return query.where('id', id).first();
  }

  async findByBusinessId(businessId: string): Promise<JobTitle[]> {
    return await JobTitle.query().where('business_id', businessId);
  }

  async create(data: Partial<JobTitle>): Promise<JobTitle> {
    return await JobTitle.create(data);
  }

  async update(id: string, data: Partial<JobTitle>): Promise<JobTitle | null> {
    const jobTitle = await JobTitle.query().where('id', id).first();
    return jobTitle ? await jobTitle.merge(data).save() : null;
  }

  async delete(id: string): Promise<boolean> {
    const jobTitle = await JobTitle.find(id);
    if (jobTitle) {
      await jobTitle.delete();
      return true;
    }
    return false;
  }

  async findByTitle(
    title: string,
    businessId: string
  ): Promise<JobTitle | null> {
    return await JobTitle.query()
      .where('title', title)
      .where('business_id', businessId)
      .first();
  }
}
