import { HttpContext } from '@adonisjs/core/http';
import EmployeeInvitationService from './employee_invitation.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import employeeInvitationValidator from './employee_invitation.validator.js';
import snakecaseKeys from 'snakecase-keys';
import { DateTime } from 'luxon';

interface InviteEmployeePayload {
  role_id: string;
  designation_id: string;
  name: string;
  email: string;
  hire_date: DateTime;
  employment_status: 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
  department_id: string;
  pay_rate: number;
  pay_rate_period: 'Hour' | 'Day' | 'Week' | 'Month' | 'Year';
  business_id: string;
  admin_id: string;
}

export default class EmployeeInvitationController {
  private employeeInvitationService: EmployeeInvitationService;

  constructor() {
    this.employeeInvitationService = new EmployeeInvitationService();
  }

  /**
   * Create an employee invitation
   */
  public async invite({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('manage');
      const rawPayload = request.all();
      await employeeInvitationValidator.fire(rawPayload, 'create');
      const payload = rawPayload as InviteEmployeePayload;
      const invitation = await this.employeeInvitationService.invite(payload);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys(invitation.toJSON(), { deep: true }),
        message: 'Employee invitation created successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage || 'Something went wrong';
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  /**
   * Validate invitation token
   */
  public async validateToken({ request, response }: HttpContext) {
    try {
      const { token } = request.all();
      
      if (!token) {
        return commonRequestErrorHandler(
          { request, response },
          'Token is required',
          400
        );
      }

      const validation = await this.employeeInvitationService.validateInvitationToken(token);
      
      if (!validation.isValid) {
        return commonRequestErrorHandler(
          { request, response },
          validation.error || 'Invalid token',
          400
        );
      }

      return genericResponse({
        request,
        response,
        data: {
          is_valid: true,
          invitation: snakecaseKeys(validation.invitation!.toJSON(), { deep: true }),
          invitation_data: snakecaseKeys(validation.invitationData!, { deep: true })
        },
        message: 'Token validation successful',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage || 'Something went wrong';
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

  /**
   * Get invitation details
   */
  public async getDetails({ request, response }: HttpContext) {
    try {
      const { token } = request.all();
      
      if (!token) {
        return commonRequestErrorHandler(
          { request, response },
          'Token is required',
          400
        );
      }

      const details = await this.employeeInvitationService.getInvitationDetails(token);
      
      if (details.error) {
        return commonRequestErrorHandler(
          { request, response },
          details.error,
          400
        );
      }

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(details, { deep: true }),
        message: 'Invitation details retrieved successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage || 'Something went wrong';
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
  }

    /**
   * Respond to an employee invitation (accept/reject)
   */
  public async respondToInvitation({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const { email, business_id, role_id, expires_at, action } = payload;
      // await employeeInvitationValidator.fire(payload, 'post');

      const result = await this.employeeInvitationService.respondToInvitation({
        action: action.toLowerCase(),
        email,
        business_id,
        role_id,
        expires_at
      });

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(result.invitation!.toJSON(), { deep: true }),
        message: `Invitation ${action.toLowerCase()}ed successfully`,
      });
  
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage || 'Something went wrong';
      return commonRequestErrorHandler(
        { request, response },
        errorMessage,
        statusCode,
        error
      );
    }
}


}
