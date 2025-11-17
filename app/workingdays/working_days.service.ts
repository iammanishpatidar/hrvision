import CustomError from '../../utilities/custom_error.js';
import WorkingDays from './working_days.model.js';
import WorkingDaysRepository from './working_days.repository.js';
import BusinessWorkingDaysMapping from './business_working_days_mapping.model.js';
import BusinessRepository from '../business/business.repository.js';
import { DateTime } from 'luxon';

export default class WorkingDayService {
  private repository: WorkingDaysRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.repository = new WorkingDaysRepository();
    this.businessRepository = new BusinessRepository();
  }

  async findAllDays(): Promise<WorkingDays[]> {
    const days = await this.repository.findAll();
    return days;
  }

  async findDayById(id: string): Promise<WorkingDays> {
    const day = await this.repository.findById(id);
    if (!day) {
      throw new CustomError('Day not found', 400);
    }
    return day;
  }

  async findByBusinessId(
    business_id: string
  ): Promise<BusinessWorkingDaysMapping[]> {
    const business = await this.businessRepository.findById(business_id);
    if (!business) {
      throw new CustomError('Business not found for ID', 400);
    }
    const workingDays = await this.repository.findByBusinessId(business_id);
    if (!workingDays) {
      throw new CustomError('No working days found for this business', 400);
    }
    return workingDays;
  }

  async createBusinessAndWorkingDaysMappings(data: {
    business_id: string;
    working_days_id: string;
  }): Promise<BusinessWorkingDaysMapping> {
    const { business_id, working_days_id } = data;

    const business = await this.businessRepository.findById(business_id);
    if (!business) {
      throw new CustomError('Business not found for ID', 400);
    }

    const day = await this.repository.findById(working_days_id);
    if (!day) {
      throw new CustomError('Working day not found for ID', 400);
    }
    const existing = await BusinessWorkingDaysMapping.query()
      .where('business_id', business_id)
      .andWhere('working_days_id', working_days_id)
      .first();

    if (existing && !existing.deletedAt) {
      existing.deletedAt = DateTime.now();
      await existing.save();
      return existing;
    }

    if (existing && existing.deletedAt) {
      existing.deletedAt = null;
      await existing.save();
      return existing;
    }
    return this.repository.create({ business_id, working_days_id });
  }
}
