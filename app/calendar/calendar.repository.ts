import CalendarEvent from './calendar.model.js'
import { DateTime } from 'luxon'

export default class calendarRepository {
  public async createCalendarEvent(calendarEvent: Partial<CalendarEvent>) {
    return await CalendarEvent.create(calendarEvent)
  }

  public async fetchCalendarEvents(filters: any) {
    const page = filters.page || 1
    const limit = Math.min(filters.limit || 20, 100)
    const offset = (page - 1) * limit

    const baseConditions = this.buildQueryConditions(filters)

    const totalCount = await CalendarEvent.query()
      .whereNull('deleted_at')
      .where(baseConditions)
      .count('* as total')
    const total = totalCount[0].$extras.total

    let query = CalendarEvent.query()
      .preload('employee')
      .preload('holiday')
      .preload('leave')
      .whereNull('deleted_at')
      .where(baseConditions)

    if (filters.start_date && filters.end_date) {
      query = query.whereBetween('date', [filters.start_date, filters.end_date])
    } else if (filters.date_from && filters.date_to) {
      query = query.whereBetween('date', [filters.date_from, filters.date_to])
    }

    if (filters.search) {
      query = query.where((subQuery) => {
        subQuery
          .whereILike('title', `%${filters.search}%`)
          .orWhereILike('description', `%${filters.search}%`)
      })
    }

    const sortBy = filters.sort_by || 'date'
    const sortOrder = filters.sort_order || 'asc'
    query = query.orderBy(sortBy, sortOrder)

    query = query.offset(offset).limit(limit)

    const events = await query

    const eventsByDate = this.groupEventsByDate(events)

    const totalPages = Math.ceil(total / limit)
    const currentPage = page
    const hasNextPage = currentPage < totalPages
    const hasPreviousPage = currentPage > 1
    return {
      events_by_date: eventsByDate,
      total_count: total,
      current_page: currentPage,
      total_pages: totalPages,
      has_next_page: hasNextPage,
      has_previous_page: hasPreviousPage
    }
  }

  private buildQueryConditions(filters: any) {
    const conditions: any = {}

    if (filters.business_id) {
      conditions.business_id = filters.business_id
    }

    if (filters.event_type) {
      conditions.event_type = filters.event_type
    }

    if (filters.employee_id) {
      conditions.employee_id = filters.employee_id
    }

    if (filters.status) {
      conditions.status = filters.status
    }

    return conditions
  }

  private groupEventsByDate(events: CalendarEvent[]) {
    const eventsByDate: { [key: string]: any } = {}

    events.forEach(event => {
      const dateKey = event.date?.toISODate() || 'unknown'

      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = {
          date: dateKey,
          id: event.id,
          events: []
        }
      }

      const eventData = this.transformEventByType(event)
      if (eventData) {
        eventsByDate[dateKey].events.push(eventData)
      }
    })

    return Object.keys(eventsByDate)
      .sort()
      .map(date => eventsByDate[date])
  }

  private transformEventByType(event: CalendarEvent) {
    switch (event.event_type) {
      case 'birthday':
        return {
          type: 'birthday',
          employee: event.employee ? {
            id: event.employee.id,
            name: event.employee.name,
            email: event.employee.email,
            date_of_birth: event.employee.date_of_birth,
          } : null
        }

      case 'holiday':
        return {
          type: 'holiday',
          holiday: event.holiday ? {
            id: event.holiday.id,
            name: event.holiday.name,
            type: event.holiday.type,
            date: event.holiday.date,
            is_mandatory: event.holiday.isMandatory,
            region: event.holiday.region,
            allowed_employee_type: event.holiday.allowedEmployeeType,
          } : null
        }

      case 'leave':
        return {
          type: 'leave',
          leave: event.leave ? {
            id: event.leave.id,
            date: event.leave.date,
            status: event.leave.status,
          } : null,
          employee: event.employee ? {
            id: event.employee.id,
            name: event.employee.name,
            email: event.employee.email,
          } : null
        }

      case 'meeting':
        return {
          type: 'meeting',
          title: event.title,
          description: event.description,
          metadata: event.metadata,
          employee: event.employee ? {
            id: event.employee.id,
            name: event.employee.name,
            email: event.employee.email,
          } : null
        }

      case 'custom':
        return {
          type: 'custom',
          title: event.title,
          description: event.description,
          metadata: event.metadata
        }

      default:
        return null
    }
  }

  public async findExistingEventByDateAndEmployee(date:string, employeeId: string, eventType: string) {
    return await CalendarEvent.query()
      .where('date', date)
      .where('employee_id', employeeId)
      .where('event_type', eventType)
      .whereNull('deleted_at')
      .first()
  }

  public async findExistingEventByDateAndLeave(date:string, leaveId: string) {
    return await CalendarEvent.query()
      .where('date', date)
      .where('leave_id', leaveId)
      .whereNull('deleted_at')
      .first()
  }

  public async findExistingEventByDateAndHoliday(date: string, holidayId: string) {
    return await CalendarEvent.query()
      .where('date', date)
      .where('holiday_id', holidayId)
      .whereNull('deleted_at')
      .first()
  }

  public async findExistingEventByDateAndBusiness(date: string, businessId: string, eventType: string) {
    
    return await CalendarEvent.query()
      .where('date', date)
      .where('business_id', businessId)
      .where('event_type', eventType)
      .whereNull('deleted_at')
      .first()
  }

  public async findCalendarEventById(id: string) {
    return await CalendarEvent.query()
      .preload('employee')
      .preload('holiday')
      .preload('leave')
      .where('id', id)
      .whereNull('deleted_at')
      .first()
  }

  public async updateCalendarEvent(id: string, updateData: Partial<CalendarEvent>) {
    const event = await CalendarEvent.find(id)
    if (!event) {
      throw new Error('Calendar event not found')
    }

    await event.merge(updateData).save()
    return event
  }

  public async deleteCalendarEvent(id: string, hardDelete: boolean = false) {
    const event = await CalendarEvent.find(id)
    if (!event) {
      throw new Error('Calendar event not found')
    }

    if (hardDelete) {
      await event.delete()
    } else {
      await event.merge({ deletedAt: DateTime.now() }).save()
    }

    return { success: true, message: 'Calendar event deleted successfully' }
  }
}