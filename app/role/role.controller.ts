import { HttpContext } from '@adonisjs/core/http';
import RoleService from './role.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import snakecaseKeys from 'snakecase-keys';
import roleValidator from './role.validator.js';

export default class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public async getAllRoles({ request, response }: HttpContext) {
    try {
      const roles = await this.roleService.getAllRoles();

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          roles.map((role) => role.toJSON()),
          { deep: true }
        ),
        message: 'Roles fetched successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage;
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  public async getRoleById({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      
      await roleValidator.validateId(id);
      const role = await this.roleService.getRoleById(id);

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(role.toJSON(), { deep: true }),
        message: 'Role fetched successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage;
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }
} 