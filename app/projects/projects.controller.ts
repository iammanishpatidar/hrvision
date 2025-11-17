import { HttpContext } from '@adonisjs/core/http';
import ProjectService from './projects.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import projectValidator from './projects.validator.js';
import { ProjectStatus } from './projects.model.js';
import snakecaseKeys from 'snakecase-keys';

export default class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  public async createProject({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      await projectValidator.fire(payload, 'create');

      const project = await this.projectService.createProject(
        payload as {
          project_name: string;
          description?: string;
          business_id: string;
          status?: ProjectStatus;
        }
      );

      const projectData = project.toJSON();
      const { created_at, updated_at, ...responseData } = projectData;
      
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(responseData, { deep: true }),
        message: 'Project created successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async updateProject({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      const payload = request.all();
      
      await projectValidator.fire({ id, ...payload }, 'update');

      const project = await this.projectService.updateProject(id, payload as {
        project_name?: string;
        description?: string;
        status?: ProjectStatus;
      });

      const projectData = project.toJSON();
      const { created_at, updated_at, ...responseData } = projectData;
      
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(responseData, { deep: true }),
        message: 'Project updated successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async getProject({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      await projectValidator.fire({ id }, 'get');

      const project = await this.projectService.getProject(id);

      const projectData = project.toJSON();
      const { created_at, updated_at, ...responseData } = projectData;
      
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(responseData, { deep: true }),
        message: 'Project retrieved successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async getAllProjects({ request, response }: HttpContext) {
    try {
      await projectValidator.fire({}, 'getAll');

      const projects = await this.projectService.getAllProjects();

      const projectsData = projects.map(project => {
        const projectData = project.toJSON();
        const { created_at, updated_at, ...responseData } = projectData;
        return snakecaseKeys(responseData, { deep: true });
      });
      
      return genericResponse({
        request,
        response,
        data: projectsData,
        message: 'Projects retrieved successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async getProjectsByBusinessId({ request, response, params }: HttpContext) {
    try {
      const { business_id } = params;
      await projectValidator.fire({ business_id }, 'getByBusinessId');

      const projects = await this.projectService.getProjectsByBusinessId(business_id);

      const projectsData = projects.map(project => {
        const projectData = project.toJSON();
        const { created_at, updated_at, ...responseData } = projectData;
        return snakecaseKeys(responseData, { deep: true });
      });
      
      return genericResponse({
        request,
        response,
        data: projectsData,
        message: 'Projects retrieved successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async deleteProject({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      await projectValidator.fire({ id }, 'delete');

      await this.projectService.deleteProject(id);
      
      return genericResponse({
        request,
        response,
        data: null,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage =
        error.message || error.errorMessage || 'Something went wrong';

      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }
}
