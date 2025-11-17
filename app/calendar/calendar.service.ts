import calendarRepository from './calendar.repository.js'
import CalendarEvent from './calendar.model.js'
import CustomError from '../../utilities/custom_error.js'
import Business from '#app/business/business.model'
import Employee from '#app/employee/employee.model'
import Leave from '#app/leaves/leaves.model'
import HolidayPolicy from '#app/holidayPolicy/holidayPolicy.model'

export default class calendarService {
    private calendarRepository: calendarRepository

    constructor() {
        this.calendarRepository = new calendarRepository()
    }

    public async createCalendarEvent(calendarEvent: Partial<CalendarEvent>) {
        const business = await Business.find(calendarEvent.business_id)
        if (!business) {
            throw new CustomError('Business not found', 404)
        }
        const employee = await Employee.find(calendarEvent.employee_id)
        if (!employee) {
            throw new CustomError('Employee not found', 404)
        }
        if (employee.business_id !== business.id) {
            throw new CustomError('Employee does not belong to the specified business', 403)
        }

        await this.validateCalendarEvent(calendarEvent)

        return await this.calendarRepository.createCalendarEvent(calendarEvent)
    }

    public async updateCalendarEvent(id: string, updateData: Partial<CalendarEvent>) {
        const existingEvent = await this.calendarRepository.findCalendarEventById(id)
        if (!existingEvent) {
            throw new CustomError('Calendar event not found', 404)
        }

        if (updateData.event_type && updateData.event_type !== existingEvent.event_type) {
            await this.validateCalendarEvent({ ...existingEvent, ...updateData })
        }

        if (updateData.date) {
            await this.validateDateUpdate(existingEvent, updateData)
        }

        return await this.calendarRepository.updateCalendarEvent(id, updateData)
    }

    public async deleteCalendarEvent(id: string, hardDelete: boolean = false) {
        const existingEvent = await this.calendarRepository.findCalendarEventById(id)
        if (!existingEvent) {
            throw new CustomError('Calendar event not found', 404)
        }

        return await this.calendarRepository.deleteCalendarEvent(id, hardDelete)
    }

    public async fetchCalendarEvents(filters: any) {
        if (!filters.business_id) {
            throw new CustomError('Business ID is required for fetching calendar events', 400)
        }

        const business = await Business.find(filters.business_id)
        if (!business) {
            throw new CustomError('Business not found', 404)
        }

        if (filters.employee_id) {
            const employee = await Employee.find(filters.employee_id)
            if (!employee) {
                throw new CustomError('Employee not found', 404)
            }
            
            if (employee.business_id !== filters.business_id) {
                throw new CustomError('Employee does not belong to the specified business', 403)
            }
        }

        return await this.calendarRepository.fetchCalendarEvents(filters)
    }

    private async validateCalendarEvent(calendarEvent: Partial<CalendarEvent>) {
        if (!calendarEvent.event_type) {
            throw new CustomError('Event type is required', 400)
        }

        if (!calendarEvent.business_id) {
            throw new CustomError('Business ID is required', 400)
        }

        const business = await Business.find(calendarEvent.business_id)
        if (!business) {
            throw new CustomError('Business not found', 404)
        }

        let date: string

        switch (calendarEvent.event_type) {
            case 'birthday':
                if (!calendarEvent.employee_id) {
                    throw new CustomError('Employee ID is required for birthday events', 400)
                }
                
                const birthdayEmployee = await Employee.find(calendarEvent.employee_id)
                if (!birthdayEmployee) {
                    throw new CustomError('Employee not found', 404)
                }

                if (!birthdayEmployee.date_of_birth) {
                    throw new CustomError('Employee date of birth not found', 400)
                }
                date = birthdayEmployee.date_of_birth.toString()

                const existingBirthday = await this.calendarRepository.findExistingEventByDateAndEmployee(
                    date,
                    calendarEvent.employee_id,
                    'birthday'
                )
                if (existingBirthday) {
                    throw new CustomError('Birthday event already exists for this employee on this date', 409)
                }
                break

            case 'leave':
                if (!calendarEvent.employee_id) {
                    throw new CustomError('Employee ID is required for leave events', 400)
                }
                if (!calendarEvent.leave_id) {
                    throw new CustomError('Leave ID is required for leave events', 400)
                }

                const leaveEmployee = await Employee.find(calendarEvent.employee_id)
                if (!leaveEmployee) {
                    throw new CustomError('Employee not found', 404)
                }

                const leave = await Leave.find(calendarEvent.leave_id)
                if (!leave) {
                    throw new CustomError('Leave not found', 404)
                }

                if (!leave.date) {
                    throw new CustomError('Leave date not found', 400)
                }
                
                date = leave.date.toLocaleString();
                
                const existingLeaveByEmployee = await this.calendarRepository.findExistingEventByDateAndEmployee(
                    date,
                    calendarEvent.employee_id,
                    'leave'
                )
                if (existingLeaveByEmployee) {
                    throw new CustomError('Leave event already exists for this employee on this date', 409)
                }

                const existingLeaveById = await this.calendarRepository.findExistingEventByDateAndLeave(
                    date,
                    calendarEvent.leave_id
                )
                if (existingLeaveById) {
                    throw new CustomError('Leave event already exists for this leave ID on this date', 409)
                }
                break

            case 'holiday':
                if (!calendarEvent.holiday_id) {
                    throw new CustomError('Holiday ID is required for holiday events', 400)
                }

                const holiday = await HolidayPolicy.find(calendarEvent.holiday_id)
                if (!holiday) {
                    throw new CustomError('Holiday not found', 404)
                }

                if (!holiday.date) {
                    throw new CustomError('Holiday date not found', 400)
                }
                date = holiday.date.toLocaleString()

                const existingHolidayByBusiness = await this.calendarRepository.findExistingEventByDateAndBusiness(
                    date,
                    calendarEvent.business_id,
                    'holiday'
                )
                if (existingHolidayByBusiness) {
                    throw new CustomError('Holiday event already exists for this business on this date', 409)
                }

                const existingHolidayById = await this.calendarRepository.findExistingEventByDateAndHoliday(
                    date,
                    calendarEvent.holiday_id
                )
                if (existingHolidayById) {
                    throw new CustomError('Holiday event already exists for this holiday ID on this date', 409)
                }
                break

            case 'meeting':
                if (!calendarEvent.date) {
                    throw new CustomError('Date is required for meeting events', 400)
                }
                date = calendarEvent.date.toLocaleString()

                if (calendarEvent.employee_id) {
                    const meetingEmployee = await Employee.find(calendarEvent.employee_id)
                    if (!meetingEmployee) {
                        throw new CustomError('Employee not found', 404)
                    }

                    const existingMeeting = await this.calendarRepository.findExistingEventByDateAndEmployee(
                        date,
                        calendarEvent.employee_id,
                        'meeting'
                    )
                    if (existingMeeting && existingMeeting.title === calendarEvent.title) {
                        throw new CustomError('Meeting with same title already exists for this employee on this date', 409)
                    }
                }
                break

            case 'custom':
                if (!calendarEvent.date) {
                    throw new CustomError('Date is required for custom events', 400)
                }
                date = calendarEvent.date.toLocaleString()

                const existingCustom = await this.calendarRepository.findExistingEventByDateAndBusiness(
                    date,
                    calendarEvent.business_id,
                    'custom'
                )
                if (existingCustom && existingCustom.title === calendarEvent.title) {
                    throw new CustomError('Custom event with same title already exists for this business on this date', 409)
                }
                break

            default:
                throw new CustomError(`Invalid event type: ${calendarEvent.event_type}`, 400)
        }
    }

    private async validateDateUpdate(existingEvent: CalendarEvent, updateData: Partial<CalendarEvent>) {
        const newDate = updateData.date?.toLocaleString()

        if (!newDate) {
            throw new CustomError('Invalid date provided', 400)
        }

        switch (existingEvent.event_type) {
            case 'birthday':
                if (existingEvent.employee_id) {
                    const existingBirthday = await this.calendarRepository.findExistingEventByDateAndEmployee(
                        newDate,
                        existingEvent.employee_id,
                        'birthday'
                    )
                    if (existingBirthday && existingBirthday.id !== existingEvent.id) {
                        throw new CustomError('Birthday event already exists for this employee on this date', 409)
                    }
                }
                break

            case 'leave':
                if (existingEvent.employee_id) {
                    const existingLeave = await this.calendarRepository.findExistingEventByDateAndEmployee(
                        newDate,
                        existingEvent.employee_id,
                        'leave'
                    )
                    if (existingLeave && existingLeave.id !== existingEvent.id) {
                        throw new CustomError('Leave event already exists for this employee on this date', 409)
                    }
                }
                if (existingEvent.leave_id) {
                    const existingLeaveById = await this.calendarRepository.findExistingEventByDateAndLeave(
                        newDate,
                        existingEvent.leave_id
                    )
                    if (existingLeaveById && existingLeaveById.id !== existingEvent.id) {
                        throw new CustomError('Leave event already exists for this leave ID on this date', 409)
                    }
                }
                break

            case 'holiday':
                if (existingEvent.business_id) {
                    const existingHoliday = await this.calendarRepository.findExistingEventByDateAndBusiness(
                        newDate,
                        existingEvent.business_id,
                        'holiday'
                    )
                    if (existingHoliday && existingHoliday.id !== existingEvent.id) {
                        throw new CustomError('Holiday event already exists for this business on this date', 409)
                    }
                }
                if (existingEvent.holiday_id) {
                    const existingHolidayById = await this.calendarRepository.findExistingEventByDateAndHoliday(
                        newDate,
                        existingEvent.holiday_id
                    )
                    if (existingHolidayById && existingHolidayById.id !== existingEvent.id) {
                        throw new CustomError('Holiday event already exists for this holiday ID on this date', 409)
                    }
                }
                break

            case 'meeting':
                if (existingEvent.employee_id) {
                    const existingMeeting = await this.calendarRepository.findExistingEventByDateAndEmployee(
                        newDate,
                        existingEvent.employee_id,
                        'meeting'
                    )
                    if (existingMeeting && existingMeeting.id !== existingEvent.id && 
                        existingMeeting.title === updateData.title) {
                        throw new CustomError('Meeting with same title already exists for this employee on this date', 409)
                    }
                }
                break

            case 'custom':
                if (existingEvent.business_id) {
                    const existingCustom = await this.calendarRepository.findExistingEventByDateAndBusiness(
                        newDate,
                        existingEvent.business_id,
                        'custom'
                    )
                    if (existingCustom && existingCustom.id !== existingEvent.id && 
                        existingCustom.title === updateData.title) {
                        throw new CustomError('Custom event with same title already exists for this business on this date', 409)
                    }
                }
                break
        }
    }
}