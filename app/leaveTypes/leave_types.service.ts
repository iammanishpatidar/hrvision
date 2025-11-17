import CustomError from '../../utilities/custom_error.js';
import LeaveTypes from './leave_types.model.js';
import LeaveTypesRepository from './leave_types.repository.js';
import BusinessRepository from '../business/business.repository.js';

export default class LeaveTypesService {
  private repository: LeaveTypesRepository;
  private businessRepository: BusinessRepository;
  constructor() {
    this.repository = new LeaveTypesRepository();
    this.businessRepository = new BusinessRepository();
  }

  async createLeaveTypes(
    payload: Partial<LeaveTypes>
  ): Promise<Partial<LeaveTypes>> {
    const foundBusiness = await this.businessRepository.findById(
      payload.business_id!
    );
    if (!foundBusiness) {
      throw new CustomError('Business not found', 400);
    }
    const leaveTypes = await this.repository.create(payload);
    return leaveTypes;
  }

  async fetchLeaveTypes(
    business_id: string,
    leave_type_id?: string
  ): Promise<
    | LeaveTypes
    | {
        data: LeaveTypes[];
        meta: { total: number; page: number; limit: number };
      }
  > {
    const foundBusiness = await this.businessRepository.findById(business_id);
    if (!foundBusiness) {
      throw new CustomError('Business not found', 400);
    }

    if (leave_type_id) {
      const leaveTypes = await this.repository.findLeaveTypes(
        leave_type_id,
        business_id
      );
      if (!leaveTypes || leaveTypes.data.length === 0) {
        throw new CustomError('Leave type not found', 400);
      }
      const leaveType = leaveTypes.data[0];
      if (leaveType.business_id !== business_id) {
        throw new CustomError('Leave type not found for this business', 400);
      }
      return leaveType;
    }
    const leaveTypes = await this.repository.findLeaveTypes(
      undefined,
      business_id
    );
    return leaveTypes;
  }

  async updateLeaveTypes(
    id: string,
    data: Partial<LeaveTypes>
  ): Promise<LeaveTypes | null> {
    const leaveTypes = await this.repository.findById(id);
    if (!leaveTypes) {
      throw new CustomError('Leave type not found', 400);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { business_id, ...updateData } = data;
    return await this.repository.update(id, updateData);
  }

  async deleteLeaveTypes(id: string): Promise<boolean> {
    const leaveTypes = await this.repository.findById(id);
    if (!leaveTypes) {
      throw new CustomError('Leave type not found', 400);
    }
    await this.repository.delete(leaveTypes);
    return true;
  }
}
