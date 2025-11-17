import { HttpContext } from '@adonisjs/core/http';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';
import snakecaseKeys from 'snakecase-keys';
import DocumentFolderService from './documentFolder.service.js';
import DocumentFolderValidator from './documentFolder.validator.js';

export default class DocumentFolderController {
  private documentFolderService: DocumentFolderService;

  constructor() {
    this.documentFolderService = new DocumentFolderService();
  }

  public async create({ request, response }: HttpContext) {
    try {
      const categoryId = request.qs().category_id;
      console.log(categoryId);

      const file = request.file('document', {
        size: '10mb',
        extnames: ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
      });

      const payload = request.only(['name', 'description']);
      await DocumentFolderValidator.fire(payload, 'create');
      const created = await this.documentFolderService.create(
        categoryId,
        payload,
        file
      );

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(created.toJSON(), { deep: true }),
        message: 'Document uploaded successfully',
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
