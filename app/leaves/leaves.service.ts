import CustomError from '../../utilities/custom_error.js';
import Leaves from './leaves.model.js';
import LeavesRepository from './leaves.repository.js';
import EmployeeService from '../employee/employee.service.js';
import LeaveTypesService from '../leaveTypes/leave_types.service.js';
import calendarService from '../calendar/calendar.service.js';
import { DateTime } from 'luxon';
import leavesValidator from './leaves.validator.js';

interface LeavesFilters {
  date?: string;
  leaveType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface LeaveApplicationData {
  date: string;
  isHalfDay: boolean;
  leaveType?: string; // This field is not used in the model, but might be in payload
  employeeId: string;
  leaveTypeId: string;
  reason?: string;
}

// Add interface for incoming payload with snake_case properties
export interface LeaveApplicationPayload {
  date: string;
  is_half_day: boolean;
  employee_id: string;
  leave_type_id: string;
  reason?: string;
  status?: string;
}

// Interface for bulk leave updates
export interface LeaveUpdateData {
  id: string;
  data: LeaveApplicationPayload;
}

export default class LeavesService {
  private repository: LeavesRepository;
  private employeeService: EmployeeService;
  private leaveTypesService: LeaveTypesService;
  private calendarService: calendarService;
  constructor() {
    this.repository = new LeavesRepository();
    this.employeeService = new EmployeeService();
    this.leaveTypesService = new LeaveTypesService();
    this.calendarService = new calendarService();
  }

  async applyLeaves(
    leavesData: LeaveApplicationPayload | LeaveApplicationPayload[]
  ): Promise<Leaves[]> {
    // Validate the incoming payload (handles both single objects and arrays)
    await leavesValidator.validateBulkOrSingle(leavesData);

    const leavesArray = Array.isArray(leavesData) ? leavesData : [leavesData];
    const createdLeaves: Leaves[] = [];

    for (const leave of leavesArray) {
      const employee = await this.employeeService.fetchEmployee(
        leave.employee_id
      );
      if (!employee) {
        throw new CustomError(`Employee with ID not found`, 400);
      }

      const leaveType = await this.leaveTypesService.fetchLeaveTypes(
        employee.business_id,
        leave.leave_type_id
      );
      if (!leaveType) {
        throw new CustomError(
          `Leave type with ID not found for this business`,
          400
        );
      }

      const leaveData: Partial<Leaves> = {
        date: DateTime.fromISO(leave.date),
        is_half_day: leave.is_half_day,
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        reason: leave.reason || null,
        business_id: employee.business_id,
        status: 'PENDING',
      };
      const leaveRecord = await this.repository.create(leaveData);
      createdLeaves.push(leaveRecord);
    }
    return createdLeaves;
  }

  async updateLeaves(
    id: string,
    leavesData: LeaveApplicationPayload
  ): Promise<Leaves> {
    // Validate input data first (fail fast)
    await leavesValidator.fire({ id, ...leavesData }, 'update');

    // Get existing leave record to access employee information
    const existingLeave = await this.repository.findById(id);
    if (!existingLeave) {
      throw new CustomError('Leave not found', 400);
    }

    // If updating leave type, validate against business
    if (leavesData.leave_type_id) {
      const employee = await this.employeeService.fetchEmployee(
        existingLeave.employee_id
      );
      if (!employee) {
        throw new CustomError('Employee not found', 400);
      }

      const leaveType = await this.leaveTypesService.fetchLeaveTypes(
        employee.business_id,
        leavesData.leave_type_id
      );
      if (!leaveType) {
        throw new CustomError('Leave type not found for this business', 400);
      }
    }

    // Build update object efficiently, only including provided fields
    const leaveData: Partial<Leaves> = Object.fromEntries(
      Object.entries({
        date: leavesData.date ? DateTime.fromISO(leavesData.date) : undefined,
        is_half_day: leavesData.is_half_day,
        leave_type_id: leavesData.leave_type_id,
        reason:
          leavesData.reason !== undefined
            ? leavesData.reason || null
            : undefined,
      }).filter((entry) => entry[1] !== undefined)
    );

    const updatedLeave = await this.repository.update(id, leaveData);

    if (!updatedLeave) {
      throw new CustomError('Failed to update leave', 400);
    }

    return updatedLeave;
  }

  async getEmployeeLeaves(
    employeeId: string,
    filters?: LeavesFilters & { leave_id?: string }
  ): Promise<{
    data: Leaves | Leaves[];
    meta?: { total: number; page: number; limit: number };
  }> {
    const employee = await this.employeeService.fetchEmployee(employeeId);
    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }

    if (filters?.leave_id) {
      const leave = await this.repository.findById(filters.leave_id);
      if (!leave) {
        throw new CustomError('Leave not found', 400);
      }
      return { data: leave };
    }
    const result = await this.repository.findByEmployeeId(employeeId, filters);
    if (!result.data.length) {
      throw new CustomError('No leaves found for this employee', 400);
    }
    return result;
  }

  async deleteLeaves(id: string): Promise<boolean> {
    const leave = await this.repository.findById(id);
    if (!leave) {
      throw new CustomError('Leave not found', 400);
    }
    const deleted = await this.repository.delete(id);
    return deleted;
  }

  private async updateCalendarForLeave(leave: Leaves, status: string) {
    try {
      const existingEvent = await this.calendarService.fetchCalendarEvents({
        business_id: leave.business_id,
        event_type: 'leave' as const,
        leave_id: leave.id
      });

      if (status === 'APPROVED') {
        const calendarEventData = {
          business_id: leave.business_id,
          employee_id: leave.employee_id,
          leave_id: leave.id,
          event_type: 'leave' as const,
          title: `Leave - ${leave.reason || 'No reason provided'}`,
          description: leave.reason || null,
          date: leave.date,
          status: 'active' as const
        };

        if (existingEvent.events_by_date?.length > 0) {
          // Update existing event
          const event = existingEvent.events_by_date[0];
          await this.calendarService.updateCalendarEvent(event.id, calendarEventData);
        } else {
          // Create new event
          await this.calendarService.createCalendarEvent(calendarEventData);
        }
      } else if (status === 'REJECT' && existingEvent.events_by_date?.length > 0) {
        // If leave is rejected, mark calendar event as cancelled
        const event = existingEvent.events_by_date[0];
        await this.calendarService.updateCalendarEvent(event.id, {
          status: 'cancelled' as const
        });
      }
    } catch (error) {
      console.error('Error updating calendar event for leave:', error);
      // Don't throw the error as this is a secondary operation
    }
  }

  async updateLeavesStatus(
    id: string,
    status: string,
    userId: string
  ): Promise<Leaves> {
    const leave = await this.repository.findById(id);
    if (!leave) {
      throw new CustomError('Leave not found', 400);
    }
    const employee = await this.employeeService.fetchEmployee(
      leave.employee_id
    );
    if (employee.manager_id != userId) {
      throw new CustomError('You are not authorized to update this leave', 400);
    }

    const updatedLeave = await this.repository.updateStatus(id, status);
    if (!updatedLeave) {
      throw new CustomError('Leave not found or failed to update status', 400);
    }

    // Update calendar event based on leave status
    await this.updateCalendarForLeave(updatedLeave, status);

    return updatedLeave;
  }

  async getLeavesByBusinessId(
    businessId: string,
    filters?: LeavesFilters
  ): Promise<{
    data: Leaves[];
    meta: { total: number; page: number; limit: number };
  }> {
    // Optionally, you can validate businessId here if needed
    const result = await this.repository.findByBusinessId(businessId, filters);
    if (!result.data.length) {
      throw new CustomError('No leaves found for this business', 400);
    }
    return result;
  }
}