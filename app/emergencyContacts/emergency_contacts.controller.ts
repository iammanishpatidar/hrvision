import { HttpContext } from '@adonisjs/core/http';
import EmergencyContactService from './emergency_contacts.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import emergencyContactValidator from './emergency_contacts.validator.js';
import snakecaseKeys from 'snakecase-keys';

export default class AllowanceController {
  private emergencyContactService: EmergencyContactService;

  constructor() {
    this.emergencyContactService = new EmergencyContactService();
  }

  public async updateEmergencyContact({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const { id } = request.params();

      await emergencyContactValidator.validateId(id);
      await emergencyContactValidator.fire(payload, 'update');

      const emergencyContact = await this.emergencyContactService.updateContact(
        id,
        payload
      );

      if (!emergencyContact) {
        return commonRequestErrorHandler(
          { request, response },
          'Emergency contact not found or update failed.',
          404
        );
      }

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            updated_emergency_contact: emergencyContact.toJSON(),
          },
          { deep: true }
        ),
        message: 'Emergency contact updated successfully',
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

  public async fetchEmergencyContact({ request, response }: HttpContext) {
    try {
      const { id } = request.params();

      await emergencyContactValidator.validateId(id);

      const emergencyContact =
        await this.emergencyContactService.getContactById(id);

      if (!emergencyContact) {
        return commonRequestErrorHandler(
          { request, response },
          'Emergency contact not found.',
          404
        );
      }

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(
          {
            emergency_contact: emergencyContact.toJSON(),
          },
          { deep: true }
        ),
        message: 'Emergency contact fetched successfully',
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
}
