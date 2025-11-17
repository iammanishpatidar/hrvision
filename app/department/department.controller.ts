import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { HttpContext } from '@adonisjs/core/http';
import DepartmentService from './department.service.js';
import { identity } from 'lodash';
// import departmentValidator from './department.validator.js';


export default class DepartmentController {
  private service: DepartmentService;
  constructor() {
    this.service = new DepartmentService();
  }
  async fetchDepartment({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      const department = await this.service.fetchDepartmentById(id);
      return genericResponse({
        request,
        response,
        data: department,
        message: 'Department listed',
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

  async fetchAllDepartments({ request, response }: HttpContext) {
    try {
      const departments = await this.service.fetchAllDepartments();
      return genericResponse({
        request,
        response,
        data: departments,
        message: 'Departments listed',
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
  //   TODO Remaining necessary APIS
}
