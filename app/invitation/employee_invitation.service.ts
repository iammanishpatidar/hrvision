import EmployeeInvitation from './employee_invitation.model.js';
import EmployeeInvitationRepository from './employee_invitation.repository.js';
import EmployeeRepository from '../employee/employee.repository.js';
import DesignationRepository from '../designation/designation.repository.js';
import Department from '../department/department.model.js';
import Business from '../business/business.model.js';
import Role from '../role/role.model.js';
import { DateTime } from 'luxon';
import crypto from 'crypto';
import db from '@adonisjs/lucid/services/db';
import CustomError from '../../utilities/custom_error.js';
import { EncryptionService } from '../../utilities/encryption.js';
import { sendEmail } from '../../utilities/mailer.js';
import { emailTemplate } from '../../utilities/email_template.js';
import env from '#start/env';
import { StatusEnum } from '../../constants/invitationMail.js';

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

export default class EmployeeInvitationService {
  private repository: EmployeeInvitationRepository;
  private employeeRepository: EmployeeRepository;
  private designationRepository: DesignationRepository;

  constructor() {
    this.repository = new EmployeeInvitationRepository();
    this.employeeRepository = new EmployeeRepository();
    this.designationRepository = new DesignationRepository();
  }


  async invite(payload: InviteEmployeePayload): Promise<EmployeeInvitation> {
    const trx = await db.transaction();

    try {
      const [business, department, designation, role] = await Promise.all([
        Business.find(payload.business_id),
        Department.find(payload.department_id),
        this.designationRepository.findById(payload.designation_id),
        Role.find(payload.role_id)
      ]);
      if (!business) {
        throw new CustomError('Business not found', 400);
      }
      if (!department) {
        throw new CustomError('Department not found', 400);
      }
      if (!designation) {
        throw new CustomError('Designation not found', 400);
      }
      if (!role) {
        throw new CustomError('Role not found', 400);
      }

      const existingEmployeeByEmail = await this.employeeRepository.findByEmail(payload.email);
      if (existingEmployeeByEmail) {
        throw new CustomError('Employee with this email already exists', 400);
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = DateTime.now().plus({ days: 7 }); 
        const employeeData = {
        name: payload.name,
        email: payload.email,
        business_id: payload.business_id,
        department_id: payload.department_id,
        date_of_hire: payload.hire_date,
        employment_type: payload.employment_status,
        designation_id: payload.designation_id,
        role_id: payload.role_id,
      };
      const employee = await this.employeeRepository.create(employeeData, trx);
      const invitationData = {
        employee_id: employee.id,
        admin_id: payload.admin_id,
        token,
        expires_at: expiresAt,
        status: StatusEnum.INVITED as const,
      };
      const invitation = await this.repository.create(invitationData, trx);
      const encryptedEmail = EncryptionService.encryptInvitationData({ value: payload.email });
      const encryptedBusinessId = EncryptionService.encryptInvitationData({ value: payload.business_id });
      const encryptedRoleId = EncryptionService.encryptInvitationData({ value: payload.role_id });
      const encryptedExpiresAt = EncryptionService.encryptInvitationData({ value: expiresAt.toMillis().toString() });

      const frontendUrl = env.get('FRONTEND_URL');
      const invitationLink = `${frontendUrl}/invitation/accept` + `?email=${encodeURIComponent(encryptedEmail)}` +
        `&business_id=${encodeURIComponent(encryptedBusinessId)}` + `&role_id=${encodeURIComponent(encryptedRoleId)}` +
        `&expires_at=${encodeURIComponent(encryptedExpiresAt)}`;

      // Generate email template
      const emailData = emailTemplate({
        companyName: business.name,
        recipientEmail: payload.email,
        invitationLink: invitationLink,
        logo: business.logo,
        brandColor: business.primary_color || '#0066FF',
        accentColor: business.secondary_color || '#4318FF'
      });

      // Send invitation email
      try {
        await sendEmail({
          to: emailData.to,
          subject: emailData.subject,
          htmlContent: emailData.htmlContent
        });
        
        console.log(`Invitation email sent successfully to ${payload.email}`);
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
        // Email failure should not rollback the transaction
        // The employee and invitation are created successfully
      }

      await trx.commit();
      return invitation;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Responds to an employee invitation (accept/reject)
   */
   async respondToInvitation(params: {
    action: 'accept' | 'reject';
    email: string;
    business_id: string;
    role_id: string;
    expires_at: string;
  }): Promise<{ success: boolean; invitation?: EmployeeInvitation; error?: string }> {
    const trx = await db.transaction();

    try {
      const validation = await this.validateInvitationToken({
        email: params.email,
        business_id: params.business_id,
        role_id: params.role_id,
        expires_at: params.expires_at 
      });

      if (!validation.isValid || !validation.invitation) {
        await trx.rollback(); // Release transaction on early return
        return { success: false, error: validation.error || 'Invalid invitation' };
      }

      const invitation = validation.invitation;
      if (invitation.status !== StatusEnum.INVITED) {
        await trx.rollback(); // Release transaction on early return
        return { success: false, error: `Invitation already ${invitation.status.toLowerCase()}` };
      }

      if (params.action === StatusEnum.ACCEPTED.toLowerCase()) {
        invitation.status = StatusEnum.ACCEPTED;
      } else {
        invitation.status = StatusEnum.REJECTED;
      }

      await invitation.useTransaction(trx).save();

      await trx.commit();
      return { success: true, invitation };
    } catch (error) {
      await trx.rollback();
      throw new CustomError(`Error while responding with error ${error}`, 400);
    }
  }

  /**
   * Validates and retrieves invitation data from encrypted params
   */
  async validateInvitationToken(params: {
    email: string;
    business_id: string;
    role_id: string;
    expires_at: string;
  }): Promise<{
    isValid: boolean;
    invitation?: EmployeeInvitation;
    invitationData?: { email: string; businessId: string; roleId: string; expiresAt: string };
    error?: string;
  }> {
    try {
      // Decode and decrypt each value
      const email = EncryptionService.decryptValue(decodeURIComponent(params.email));
      const businessId = EncryptionService.decryptValue(decodeURIComponent(params.business_id));
      const roleId = EncryptionService.decryptValue(decodeURIComponent(params.role_id));
      const expiresAt = EncryptionService.decryptValue(decodeURIComponent(params.expires_at));

      // Look up the invitation by email + business + role
      const invitation = await EmployeeInvitation.query()
        .whereHas('employee', (q) => {
          q.where('email', email).andWhere('business_id', businessId).andWhere('role_id', roleId);
        })
        .first();

      if (!invitation) {
        return { isValid: false, error: 'Invitation not found' };
      }

      // Check if invitation has expired
      if (invitation.expires_at < DateTime.now()) {
        return { isValid: false, error: 'Invitation has expired' };
      }

      // Check invitation status
      if (invitation.status !== 'INVITED') {
        return { isValid: false, error: `Invitation is ${invitation.status.toLowerCase()}` };
      }

      return {
        isValid: true,
        invitation,
        invitationData: { email, businessId, roleId, expiresAt }
      };
    } catch (error) {
      console.error('Error validating invitation params:', error);
      return { isValid: false, error: 'Failed to validate invitation params' };
    }
  }

  /**
   * Retrieves invitation details for display purposes
   */
  async getInvitationDetails(params: {
    email: string;
    business_id: string;
    role_id: string;
    expires_at: string;
  }): Promise<{
    invitation?: EmployeeInvitation;
    error?: string;
  }> {
    const validation = await this.validateInvitationToken(params);

    if (!validation.isValid) {
      return { error: validation.error };
    }

    return { invitation: validation.invitation };
  }
}

