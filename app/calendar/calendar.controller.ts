import { HttpContext } from '@adonisjs/core/http'
import calendarService from './calendar.service.js'
import { genericResponse } from '../../utilities/response_handler.js'
import { commonRequestErrorHandler } from '../../utilities/error_handler.js'
import snakecaseKeys from 'snakecase-keys'
import calendarEventValidator from './calendar.validator.js'

export default class calendarController {
    private calendarService: calendarService

    constructor() {
        this.calendarService = new calendarService()
    }

    public async createCalendarEvent({ request, response }: HttpContext) {
        try {
            await calendarEventValidator.fire(request.all(), 'create')
            const validatedData = request.all()
            const createdCalendarEvent = await this.calendarService.createCalendarEvent(validatedData)
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ createdEvent: createdCalendarEvent.toJSON() }, { deep: true }),
                message: 'Calendar event created successfully',
            })
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || error.errorMessage;
            return commonRequestErrorHandler(
                { request, response },
                errorMessage,
                statusCode,
                error
            );
        }
    }

    public async fetchCalendarEvents({ request, response }: HttpContext) {
        try {
            await calendarEventValidator.fire(request.qs(), 'fetch')
            const filters = request.qs()
            const calendarEvents = await this.calendarService.fetchCalendarEvents(filters)
            
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ 
                    events_by_date: calendarEvents.events_by_date,
                    total_count: calendarEvents.total_count,
                    current_page: calendarEvents.current_page,
                    total_pages: calendarEvents.total_pages,
                    has_next_page: calendarEvents.has_next_page,
                    has_previous_page: calendarEvents.has_previous_page
                }, { deep: true }),
                message: 'Calendar events fetched successfully',
            })
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || error.errorMessage;
            return commonRequestErrorHandler(
                { request, response },
                errorMessage,
                statusCode,
                error
            );
        }
    }

    public async updateCalendarEvent({ request, response }: HttpContext) {
        try {
            await calendarEventValidator.fire(request.all(), 'update')
            const validatedData = request.all()
            const { id, ...updateData } = validatedData
            
            const updatedCalendarEvent = await this.calendarService.updateCalendarEvent(id, updateData)
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ updatedEvent: updatedCalendarEvent.toJSON() }, { deep: true }),
                message: 'Calendar event updated successfully',
            })
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || error.errorMessage;
            return commonRequestErrorHandler(
                { request, response },
                errorMessage,
                statusCode,
                error
            );
        }
    }

    public async deleteCalendarEvent({ request, response }: HttpContext) {
        try {
            await calendarEventValidator.fire(request.all(), 'delete')
            const { id, hard_delete } = request.all()
            
            const result = await this.calendarService.deleteCalendarEvent(id, hard_delete || false)
            return genericResponse({
                request,
                response,
                data: snakecaseKeys(result, { deep: true }),
                message: 'Calendar event deleted successfully',
            })
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || error.errorMessage;
            return commonRequestErrorHandler(
                { request, response },
                errorMessage,
                statusCode,
                error
            );
        }
    }
}