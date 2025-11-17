import { HttpContext } from '@adonisjs/core/http';
import EmployeeService from './employee.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import snakecaseKeys from 'snakecase-keys';
import employeeValidator from './employee.validator.js';

export default class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  public async fetchEmployee({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      const employee = await this.employeeService.fetchEmployee(id);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            business: employee.business.toJSON(),
            employee: employee.toJSON(),
          },
          { deep: true }
        ),
        message: `Employee data fetched successfully`,
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

  public async updateEmployee({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      const payload = request.all();
      await employeeValidator.fire(payload, 'update');
      const updatedEmployee = await this.employeeService.updateEmployee(
        id,
        payload
      );
      if (!updatedEmployee) {
        return commonRequestErrorHandler(
          { request, response },
          'Employee not found or update failed.',
          404
        );
      }
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            updated_employee: updatedEmployee.toJSON(),
          },
          { deep: true }
        ),
        message: `Employee updated successfully`,
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

  public async deleteEmployeeByID({ request, response }: HttpContext) {
    try {
      const { id } = request.params();

      await this.employeeService.deleteEmployee(id);
      return genericResponse({
        request,
        response,
        message: `Employee Deleted Successfully`,
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


public async fetchEmployeesByBusiness({ request, response }: HttpContext) {
  try {
    const businessId = request.qs().business_id

    const employees = await this.employeeService.fetchEmployeesByBusiness(businessId)

    return genericResponse({
      request,
      response,
      data: snakecaseKeys(employees.map(e => e.toJSON()), { deep: true }),
      message: 'Employees fetched successfully',
    })
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || error.errorMessage;
    return commonRequestErrorHandler(
      { request, response },
      errorMessage,
      statusCode,
      error
    )
  }
}

// This method is for Testing purposes only
  public async getAllEmployees({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');
      const employees = await this.employeeService.getAllEmployees();
      return genericResponse({
        request,
        response,
        data: employees.map((employee) => snakecaseKeys(employee.toJSON(), { deep: true })),
        message: `Employees fetched successfully`,
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
