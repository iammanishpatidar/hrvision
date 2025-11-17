import TimeTracking from "./timeTracking.model.js";

export default class TimeTrackingRepository {
  private readonly timeTrackingModel: typeof TimeTracking;

  constructor() {
    this.timeTrackingModel = TimeTracking;
  }

  async create(timeTracking: Partial<TimeTracking>): Promise<TimeTracking> {
    return this.timeTrackingModel.create(timeTracking);
  }

  async findAll(): Promise<TimeTracking[]> {
    return this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .preload('business')
      .preload('employee');
  }

  async findById(id: string): Promise<TimeTracking | null> {
    return this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .where('id', id)
      .preload('business')
      .preload('employee')
      .first();
  }

  async findByBusinessId(businessId: string): Promise<TimeTracking[]> {
    return this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .where('business_id', businessId)
      .preload('business')
      .preload('employee');
  }

  async findByEmployeeId(employeeId: string): Promise<TimeTracking[]> {
    return this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .where('employee_id', employeeId)
      .preload('business')
      .preload('employee');
  }

  async update(id: string, data: Partial<TimeTracking>): Promise<TimeTracking | null> {
    const timeTracking = await this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .where('id', id)
      .first();
    
    if (!timeTracking) {
      return null;
    }

    return timeTracking.merge(data).save();
  }

  async delete(id: string): Promise<boolean> {
    const timeTracking = await this.timeTrackingModel.query()
      .whereNull('deleted_at')
      .where('id', id)
      .first();
    
    if (!timeTracking) {
      return false;
    }

    await timeTracking.delete();
    return true;
  }
}
