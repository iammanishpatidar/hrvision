import { HttpContext } from '@adonisjs/core/http';
import LeavesService, { LeaveApplicationPayload } from './leaves.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import leavesValidator from './leaves.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class LeavesController {
  private leavesService: LeavesService;

  constructor() {
    this.leavesService = new LeavesService();
  }

  /**
   * Apply for leave(s)
   */
  public async applyLeaves({ request, response }: HttpContext) {
    try {
      const rawBody = request.body();
      const mappings = Array.isArray(rawBody)
        ? rawBody
        : Object.values(rawBody);
      if (!Array.isArray(mappings)) {
        throw new Error(
          'Invalid input. Expected an array of leave applications'
        );
      }
      await leavesValidator.validateBulkOrSingle(mappings);
      const leaves = await this.leavesService.applyLeaves(
        mappings as LeaveApplicationPayload[]
      );
      const responseData = leaves.map((entry) => entry.toJSON());

      return genericResponse({
        request,
        response,
        message: 'Leaves applied successfully',
        data: snakecaseKeys({ leaves: responseData }, { deep: true }),
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

  /**
   * Update leave
   */
  public async updateLeaves({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      const leavesData = request.all();
      await leavesValidator.fire({ id, ...leavesData }, 'update');
      const updatedLeaves = await this.leavesService.updateLeaves(
        id,
        leavesData as LeaveApplicationPayload
      );
      return genericResponse({
        request,
        response,
        message: 'Leaves updated successfully',
        data: snakecaseKeys(JSON.parse(JSON.stringify(updatedLeaves)), {
          deep: true,
        }),
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

  /**
   * Get employee leaves
   */
  public async getEmployeeLeaves({ request, response, params }: HttpContext) {
    try {
      const { employeeId } = params;
      const { startDate, endDate, leaveType, leave_id } = request.qs();
      await leavesValidator.fire(
        {
          employee_id: employeeId,
          leave_type_id: leaveType,
          id: leave_id,
        },
        'fetch'
      );
      const filters = { startDate, endDate, leaveType, leave_id };
      const leaves = await this.leavesService.getEmployeeLeaves(
        employeeId,
        filters
      );
      return genericResponse({
        request,
        response,
        message: 'Employee leaves retrieved successfully',
        data: snakecaseKeys(JSON.parse(JSON.stringify(leaves)), { deep: true }),
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

  /**
   * Delete leave
   */
  public async delete({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      await leavesValidator.fire({ id: id }, 'delete');
      const deleted = await this.leavesService.deleteLeaves(id);
      return genericResponse({
        request,
        response,
        message: 'Leaves deleted successfully',
        data: snakecaseKeys(JSON.parse(JSON.stringify(deleted)), {
          deep: true,
        }),
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

  /**
   * Update leave status
   */
  public async updateLeavesStatus({ request, response, params }: HttpContext) {
    try {
      const { id } = params;
      const { status } = request.body();
      await leavesValidator.fire({ id, status }, 'update_status');
      const updatedLeave = await this.leavesService.updateLeavesStatus(
        id,
        status,
        request.user_id!
      );
      return genericResponse({
        request,
        response,
        message: 'Leave status updated successfully',
        data: snakecaseKeys(JSON.parse(JSON.stringify(updatedLeave)), {
          deep: true,
        }),
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

  public async getLeavesByBusinessId({ request, response }: HttpContext) {
    try {
      const { businessId } = request.params();
      const { status, leaveType, date, page, limit } = request.qs();

      // Build filters object
      const filters = {
        status,
        leaveType,
        date,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };

      const leaves = await this.leavesService.getLeavesByBusinessId(
        businessId,
        filters
      );

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            leaves: leaves.data.map((e) => e.toJSON()),
            meta: leaves.meta,
          },
          { deep: true }
        ),
        message: 'leaves fetched successfully',
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
