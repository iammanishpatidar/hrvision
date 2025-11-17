import Project, { ProjectStatus } from './projects.model.js';
import ProjectRepository from './projects.repository.js';
import projectValidator from './projects.validator.js';
import CustomError from '../../utilities/custom_error.js';
import BusinessRepository from '../business/business.repository.js';

export default class ProjectService {
  private repository: ProjectRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.repository = new ProjectRepository();
    this.businessRepository = new BusinessRepository();
  }

  async createProject(payload: {
    project_name: string;
    description?: string;
    business_id: string;
    status?: ProjectStatus;
  }): Promise<Project> {
    await projectValidator.fire(payload, 'create');
    
    // Validate business exists
    const findBusiness = await this.businessRepository.findById(
      payload.business_id
    );
    if (!findBusiness) {
      throw new CustomError('Business not found', 404);
    }

    // Check if project name already exists in this business
    const existingProject = await this.repository.findByProjectName(
      payload.project_name,
      payload.business_id
    );

    if (existingProject) {
      throw new CustomError(
        `A project with the name "${payload.project_name}" already exists in this business`,
        400
      );
    }

    const projectData = {
      ...payload,
      status: payload.status || ProjectStatus.ACTIVE,
    };

    const project = await this.repository.create(projectData);
    return project;
  }

  async updateProject(id: string, payload: {
    project_name?: string;
    description?: string;
    status?: ProjectStatus;
  }): Promise<Project> {
    await projectValidator.fire({ id, ...payload }, 'update');
    
    const project = await this.repository.findById(id);
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    // Check if project name already exists in this business (if name is being updated)
    if (payload.project_name && payload.project_name !== project.project_name) {
      const existingProject = await this.repository.findByProjectName(
        payload.project_name,
        project.business_id
      );

      if (existingProject) {
        throw new CustomError(
          `A project with the name "${payload.project_name}" already exists in this business`,
          400
        );
      }
    }

    const updatedProject = await this.repository.update(id, payload);
    if (!updatedProject) {
      throw new CustomError('Failed to update project', 500);
    }

    return updatedProject;
  }

  async getProject(id: string): Promise<Project> {
    await projectValidator.fire({ id }, 'get');
    
    const project = await this.repository.findById(id);
    if (!project) {
      throw new CustomError('Project not found', 404);
    }

    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.repository.getAll();
  }

  async getProjectsByBusinessId(businessId: string): Promise<Project[]> {
    await projectValidator.fire({ business_id: businessId }, 'getByBusinessId');
    
    // Validate business exists
    const findBusiness = await this.businessRepository.findById(businessId);
    if (!findBusiness) {
      throw new CustomError('Business not found', 404);
    }

    return await this.repository.findByBusinessId(businessId);
  }

  async deleteProject(id: string): Promise<void> {
    await projectValidator.fire({ id }, 'delete');
    
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new CustomError('Project not found', 404);
    }
  }
}
