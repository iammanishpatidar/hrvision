import Business from './business.model.js';
import BusinessRepository from './business.repository.js';
import businessValidator from './business.validator.js';
import AddressService from '../address/address.service.js';
import db from '@adonisjs/lucid/services/db';
import CustomError from '../../utilities/custom_error.js';
import RoleRepository from '../role/role.repository.js';
import EmployeeRepository from '../employee/employee.repository.js';
import EmergencyContactRepository from '../emergencyContacts/emergency_contacts.repository.js';
import Employee from '#app/employee/employee.model';
import {
  CreateBusinessPayload,
  UpdateBusinessPayload,
} from './business.types.js';
import { DateTime } from 'luxon';
import { uploadFileToS3 } from '../../utilities/file_upload.utilities.js';
import type { MultipartFile } from '@adonisjs/core/bodyparser';

export default class BusinessService {
  private repository: BusinessRepository;
  private addressService: AddressService;
  private roleRepository: RoleRepository;
  private employeeRepository: EmployeeRepository;
  private emergencyContactRepository: EmergencyContactRepository;

  constructor() {
    this.repository = new BusinessRepository();
    this.addressService = new AddressService();
    this.roleRepository = new RoleRepository();
    this.employeeRepository = new EmployeeRepository();
    this.emergencyContactRepository = new EmergencyContactRepository();
  }

  async createBusiness(
    payload: CreateBusinessPayload
  ): Promise<{ business: Business; employee: Employee }> {
    const trx = await db.transaction();

    try {
      if (!payload.address) {
        throw new CustomError('Address is required', 400);
      }

      if (!payload.admin?.email) {
        throw new CustomError('Admin email is required', 400);
      }

      const address = await this.addressService.createAddress(
        payload.address,
        trx
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { admin, address: _, ...restBusinessPayload } = payload;

      const businessPayload = {
        ...restBusinessPayload,
        address_id: address.id,
      };

      const existingBusiness = await this.repository.findByFields(
        {
          email: businessPayload.email,
          contact_number: businessPayload.contact_number,
          name: businessPayload.name,
        },
        trx
      );

      if (existingBusiness) {
        const conflictingFields: string[] = [];
        if (existingBusiness.email === businessPayload.email)
          conflictingFields.push('email');
        if (existingBusiness.contact_number === businessPayload.contact_number)
          conflictingFields.push('contact number');
        if (existingBusiness.name === businessPayload.name)
          conflictingFields.push('business name');

        throw new CustomError(
          `A business with the same ${conflictingFields.join(', ')} already exists`,
          400
        );
      }

      const business = await this.repository.create(businessPayload, trx);

      const [isAdminExist, findEmployeeById] = await Promise.all([
        this.employeeRepository.findByEmail(admin.email),
        this.employeeRepository.findByClerkId(admin.clerk_id),
      ]);

      if (isAdminExist || findEmployeeById) {
        const message = isAdminExist
          ? 'Admin email already exists'
          : ' clerk id already exists';
        throw new CustomError(message, 400);
      }

      const adminRole = await this.roleRepository.findByRole('ADMIN', trx);
      if (!adminRole) {
        throw new CustomError('Role not found', 400);
      }

      let permanentAddressId: string | undefined = undefined;
      let currentAddressId: string | undefined = undefined;

      if (admin.permanent_address) {
        const permanentAddress = await this.addressService.createAddress(
          admin.permanent_address,
          trx
        );
        permanentAddressId = permanentAddress.id;
      }

      if (admin.current_address) {
        const currentAddress = await this.addressService.createAddress(
          admin.current_address,
          trx
        );
        currentAddressId = currentAddress.id;
      }

      const adminData = {
        clerk_id: admin.clerk_id,
        email: admin.email,
        date_of_birth: DateTime.fromISO(admin.date_of_birth),
        blood_group: admin.blood_group,
        gender: admin.gender,
        role_id: adminRole.id,
        business_id: business.id,
        permanent_address_id: permanentAddressId,
        current_address_id: currentAddressId,
        contact_number: admin.contact_number,
        marital_status: admin.marital_status,
        name: admin.name,
        religion: admin.religion,
      };

      const employee = await this.employeeRepository.create(adminData, trx);

      if (admin.emergency_contact) {
        const contact = admin.emergency_contact;
        let contactAddressId: string | undefined = undefined;

        if (contact.address) {
          const contactAddress = await this.addressService.createAddress(
            contact.address,
            trx
          );
          contactAddressId = contactAddress.id;
        }

        await this.emergencyContactRepository.create(
          {
            name: contact.name,
            relationship: contact.relationship,
            contact_number: contact.contact_number,
            address_id: contactAddressId,
            employee_id: employee.id,
          },
          trx
        );
      }

      await trx.commit();

      return { business, employee };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async updateBusiness(
    id: string,
    payload: Partial<UpdateBusinessPayload>
  ): Promise<Business> {
    const existingBusiness = await this.repository.findById(id);
    if (!existingBusiness) {
      throw new CustomError('Business not found', 400);
    }
    const transformedPayload: Partial<Business> = {
      ...payload,
      time_off_cycle_start_date: payload.time_off_cycle_start_date
        ? DateTime.fromISO(payload.time_off_cycle_start_date)
        : undefined,
      time_off_cycle_end_date: payload.time_off_cycle_end_date
        ? DateTime.fromISO(payload.time_off_cycle_end_date)
        : undefined,
    };
    const updatedBusiness = await this.repository.update(
      id,
      transformedPayload
    );
    if (!updatedBusiness) {
      throw new CustomError('Failed to update business', 400);
    }
    return updatedBusiness;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    await businessValidator.validateId(id);
    const deleteBusiness = await this.repository.delete(id);
    if (!deleteBusiness) {
      throw new CustomError('Business not found', 400);
    }
    return true;
  }

  async fetchBusiness(id?: string): Promise<{
    data: Business[];
    meta: { total: number; page: number; limit: number };
  }> {
    const page = 1;
    const limit = 10;
    if (id) {
      await businessValidator.validateId(id);
      const business = await this.repository.findWithAddressByBusinessId(id);
      if (!business) {
        throw new CustomError('Business not found', 400);
      }
      return {
        data: [business],
        meta: { total: 1, page: 1, limit: 1 },
      };
    }
    const result = await this.repository.paginateWithAddress(page, limit);
    return result;
  }

  async uploadBusinessLogo(id: string, logoFile: MultipartFile): Promise<Business> {
    const business = await this.repository.findById(id);
    if (!business) {
      throw new CustomError('Business not found', 400);
    }
    const logoUrl = await uploadFileToS3(logoFile);
    const updatedBusiness = await this.repository.update(id, { logo: logoUrl });
    if (!updatedBusiness) {
      throw new CustomError('Failed to update business logo', 400);
    }
    return updatedBusiness;
  }
}
