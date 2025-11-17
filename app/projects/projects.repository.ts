import Project from './projects.model.js';

export default class ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    return await Project.query().where('id', id).whereNull('deleted_at').first();
  }

  async findByBusinessId(businessId: string): Promise<Project[]> {
    return await Project.query().where('business_id', businessId).whereNull('deleted_at');
  }

  async create(data: Partial<Project>): Promise<Project> {
    return await Project.create(data);
  }

  async update(id: string, data: Partial<Project>): Promise<Project | null> {
    const project = await this.findById(id);
    if (!project) {
      return null;
    }
    
    project.merge(data);
    await project.save();
    return project;
  }

  async getAll(): Promise<Project[]> {
    return await Project.query().whereNull('deleted_at');
  }

  async findByProjectName(projectName: string, businessId: string): Promise<Project | null> {
    return await Project.query()
      .where('project_name', projectName)
      .where('business_id', businessId)
      .whereNull('deleted_at')
      .first();
  }

  async delete(id: string): Promise<boolean> {
    const project = await this.findById(id);
    if (!project) {
      return false;
    }
    
    await project.delete();
    return true;
  }
}
