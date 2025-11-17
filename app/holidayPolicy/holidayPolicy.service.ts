import { DateTime } from 'luxon';
import CustomError from '../../utilities/custom_error.js';
import BusinessRepository from '../business/business.repository.js';
import HolidayLeavePolicy from './holidayPolicy.model.js';
import HolidayPolicyRepository from './holidayPolicy.repository.js';

export default class HolidayLeavePolicyService {
  private repository: HolidayPolicyRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.repository = new HolidayPolicyRepository();
    this.businessRepository = new BusinessRepository();
  }

  async create(
    payload: Partial<HolidayLeavePolicy>
  ): Promise<HolidayLeavePolicy> {
    const { businessId, date, name } = payload;
    if (!businessId) {
      throw new CustomError('Business ID is required', 400);
    }
    if (!date) {
      throw new CustomError('Holiday date is required', 400);
    }
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new CustomError('Business not found', 400);
    }
    const holidayDate = DateTime.fromISO(date as unknown as string);
    const now = DateTime.now();
    if (!holidayDate.isValid) {
      throw new CustomError('Invalid holiday date format', 400);
    }
    if (holidayDate <= now) {
      throw new CustomError('Holiday date must be in the future', 400);
    }
    const isoDate = holidayDate.toISODate();
    if (!isoDate) {
      throw new CustomError('Invalid holiday date format', 400);
    }
    const existingHoliday = await this.repository.findByBusinessAndDate(
      businessId,
      isoDate
    );
    if (existingHoliday) {
      throw new CustomError(
        'A holiday already exists for this business on the same date',
        400
      );
    }
    if (name) {
      const duplicateName = await this.repository.findByBusinessAndName(
        businessId,
        name
      );
      if (duplicateName) {
        throw new CustomError(
          `Holiday with name "${name}" already exists for this business`,
          400
        );
      }
    }
    return this.repository.create(payload);
  }

  async updateHoliday(id: string, payload: Partial<HolidayLeavePolicy>) {
    const existingHoliday = await this.repository.findById(id);
    if (!existingHoliday) {
      throw new CustomError('Holiday not found', 400);
    }

    const { businessId, date, name } = payload;

    if (businessId && businessId !== existingHoliday.businessId) {
      const business = await this.businessRepository.findById(businessId);
      if (!business) {
        throw new CustomError('Business not found', 400);
      }
    }

    if (date) {
      const holidayDate = DateTime.fromISO(date as unknown as string);
      const now = DateTime.now();

      if (!holidayDate.isValid) {
        throw new CustomError('Invalid holiday date format', 400);
      }

      if (holidayDate <= now) {
        throw new CustomError('Holiday date must be in the future', 400);
      }

      const isoDate = holidayDate.toISODate();
      if (!isoDate) {
        throw new CustomError('Invalid holiday date format', 400);
      }

      const currentBusinessId = businessId || existingHoliday.businessId;
      const duplicateDate = await this.repository.findByBusinessAndDate(
        currentBusinessId,
        isoDate
      );

      if (duplicateDate && duplicateDate.id !== existingHoliday.id) {
        throw new CustomError(
          'A holiday already exists for this business on the same date',
          400
        );
      }
    }

    if (name) {
      const currentBusinessId = businessId || existingHoliday.businessId;
      const duplicateName = await this.repository.findByBusinessAndName(
        currentBusinessId,
        name
      );

      if (duplicateName && duplicateName.id !== existingHoliday.id) {
        throw new CustomError(
          `Holiday with name "${name}" already exists for this business`,
          400
        );
      }
    }

    return this.repository.update(id, payload);
  }

  async getAllHolidays(
    businessId: string,
    filters?: {
      month?: number;
      holidayId?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    data: HolidayLeavePolicy[];
    meta: { total: number; page: number; limit: number };
  }> {
    const { month, holidayId, page = 1, limit = 10 } = filters || {};

    if (!businessId) {
      throw new CustomError('Business ID is required', 400);
    }

    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new CustomError('Business not found', 404);
    }

    // If filtering by holidayId, return early
    if (holidayId) {
      const holiday = await this.repository.findById(holidayId);
      if (!holiday || holiday.businessId !== businessId) {
        return { data: [], meta: { total: 0, page: 1, limit } };
      }

      return {
        data: [holiday],
        meta: { total: 1, page: 1, limit },
      };
    }

    // Otherwise apply month filter and pagination
    const { data: rawData, meta } = await this.repository.findByBusinessId(
      businessId,
      page,
      limit
    );

    let filteredData = rawData;

    if (month && month >= 1 && month <= 12) {
      filteredData = rawData.filter((holiday) => {
        if (!holiday.date || !holiday.date.isValid) return false;
        return holiday.date.month === month;
      });
    }
    return {
      data: filteredData,
      meta: {
        ...meta,
        total: filteredData.length,
      },
    };
  }

  async deleteHolidayById(id: string): Promise<boolean> {
    const existingHoliday = await this.repository.findById(id);
    if (!existingHoliday) {
      throw new CustomError('Holiday not found', 400);
    }

    const business = await this.businessRepository.findById(
      existingHoliday.businessId
    );
    if (!business) {
      throw new CustomError('Associated business not found', 400);
    }

    const isDeleted = await this.repository.delete(id);
    if (!isDeleted) {
      throw new CustomError('Failed to delete holiday', 400);
    }

    return true;
  }
}
