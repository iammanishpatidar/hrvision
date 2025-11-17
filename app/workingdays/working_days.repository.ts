import WorkingDays from './working_days.model.js';
import BusinessWorkingDaysMapping from './business_working_days_mapping.model.js';

export default class WorkingDayRepository {
  async findById(id: string): Promise<WorkingDays | null> {
    const query = WorkingDays.query().where('id', id);
    return query.first();
  }

  async findByBusinessId(
    business_id: string
  ): Promise<BusinessWorkingDaysMapping[] | null> {
    return BusinessWorkingDaysMapping.query().where('business_id', business_id);
  }

  async findAll(): Promise<WorkingDays[]> {
    return WorkingDays.query();
  }

  async bulkCreate(
    entries: { business_id: string; working_days_id: string }[]
  ): Promise<BusinessWorkingDaysMapping[]> {
    return BusinessWorkingDaysMapping.createMany(entries);
  }

  async create(entry: {
    business_id: string;
    working_days_id: string;
  }): Promise<BusinessWorkingDaysMapping> {
    return BusinessWorkingDaysMapping.create(entry);
  }
}
