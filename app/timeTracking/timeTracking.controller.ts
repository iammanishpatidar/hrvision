import { HttpContext } from "@adonisjs/core/http";
import TimeTrackingService from "./timeTracking.service.js";
import { commonRequestErrorHandler } from "../../utilities/error_handler.js";
import timeTrackingValidator from "./timeTracking.validator.js";
import TimeTracking from "./timeTracking.model.js";

export default class TimeTrackingController {
  private readonly timeTrackingService: TimeTrackingService;

  constructor() {
    this.timeTrackingService = new TimeTrackingService();
  }

  private cleanTimeTrackingData(trackingData: any): any {
    delete trackingData.ipAddress;
    delete trackingData.userAgent;
    delete trackingData.sessionId;
    return trackingData;
  }

  public async create({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const payload = request.all() as Partial<TimeTracking>;
      const userId = request.header('X-User-ID');
      await timeTrackingValidator.fire(payload, 'create');
      const createdTimeTracking = await this.timeTrackingService.create(payload, userId);
      
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_tracking: this.cleanTimeTrackingData(createdTimeTracking.toJSON())
        },
        message: 'Time tracking record created successfully',
      });
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

  public async getAll({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const userId = request.header('X-User-ID') || request.qs().userId || request.body().userId;
      
      if (!userId) {
        return commonRequestErrorHandler(
          { request, response },
          'User ID is required',
          401
        );
      }

      const timeTrackings = await this.timeTrackingService.getAll(userId);
      
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_trackings: timeTrackings.map((tracking: TimeTracking) => 
            this.cleanTimeTrackingData(tracking.toJSON())
          )
        },
        message: 'Time tracking records retrieved successfully',
      });
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

  public async getAllTasks({ response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const timeTrackings = await this.timeTrackingService.getAllTasks();
      
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_trackings: timeTrackings.map((tracking: TimeTracking) => 
            this.cleanTimeTrackingData(tracking.toJSON())
          )
        },
        message: 'All time tracking records retrieved successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || error.errorMessage;
      return response.status(statusCode).json({
        statusCode,
        data: {},
        message: errorMessage || 'Internal server error'
      });
    }
  }

  public async updateTask({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const userId = request.header('X-User-ID') || request.qs().userId || request.body().userId;
      
      if (!userId) {
        return commonRequestErrorHandler(
          { request, response },
          'User ID is required',
          401
        );
      }

      const taskId = request.param('id');
      if (!taskId) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID is required' });
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(taskId)) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID must be a valid UUID' });
      }
      
      const requestPayload = request.all() as Partial<TimeTracking>;

      await timeTrackingValidator.fire(requestPayload, 'update');
      const updatedTimeTracking = await this.timeTrackingService.updateTask(taskId, requestPayload, userId);
      
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_tracking: this.cleanTimeTrackingData(updatedTimeTracking.toJSON())
        },
        message: 'Time tracking record updated successfully',
      });
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

  public async stopTask({ request, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const userId = request.header('X-User-ID') || request.qs().userId || request.body().userId;
      
      if (!userId) {
        return commonRequestErrorHandler(
          { request, response },
          'User ID is required',
          401
        );
      }

      const taskId = request.param('id');
      if (!taskId) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID is required' });
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(taskId)) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID must be a valid UUID' });
      }
      
      const stoppedTimeTracking = await this.timeTrackingService.stopTask(taskId, userId);
      
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_tracking: this.cleanTimeTrackingData(stoppedTimeTracking.toJSON())
        },
        message: 'Time tracking task stopped successfully',
      });
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

  public async getByEmployeeId({ params, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const employeeId = params.id;
      if (!employeeId) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Employee ID is required' });
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(employeeId)) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Employee ID must be a valid UUID' });
      }
      
      const tasks = await this.timeTrackingService.getAll(employeeId);
      if (!tasks || tasks.length === 0) {
        return response.status(404).json({ statusCode: 404, data: {}, message: 'No tasks found for this employee' });
      }
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_trackings: tasks.map((t: TimeTracking) => this.cleanTimeTrackingData(t.toJSON())),
        },
        message: 'Tasks fetched successfully',
      });
    } catch (error) {
      return response.status(500).json({ statusCode: 500, data: {}, message: error.message || 'Internal server error' });
    }
  }

  public async getById({ params, response, bouncer }: HttpContext) {
    try {
      await bouncer.authorize('view');

      const taskId = params.id;
      if (!taskId) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID is required' });
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(taskId)) {
        return response.status(400).json({ statusCode: 400, data: {}, message: 'Task ID must be a valid UUID' });
      }
      
      const task = await this.timeTrackingService.getById(taskId);
      if (!task) {
        return response.status(404).json({ statusCode: 404, data: {}, message: 'Task not found' });
      }
      return response.status(200).json({
        statusCode: 200,
        data: {
          time_tracking: this.cleanTimeTrackingData(task.toJSON()),
        },
        message: 'Task fetched successfully',
      });
    } catch (error) {
      return response.status(500).json({ statusCode: 500, data: {}, message: error.message || 'Internal server error' });
    }
  }

  public async invalidEmployeeEndpoint({ response }: HttpContext) {
    return response.status(400).json({ 
      statusCode: 400, 
      data: {}, 
      message: 'Employee ID is required. Please provide a valid employee ID in the URL: /time-tracking/employee/{employee-id}' 
    });
  }
}
