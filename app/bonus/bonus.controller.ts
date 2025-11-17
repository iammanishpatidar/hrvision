import { HttpContext } from '@adonisjs/core/http';
import BonusService from './bonus.service.js';
import { genericResponse } from '../../utilities/response_handler.js';
import { commonRequestErrorHandler } from '../../utilities/error_handler.js';

export default class BonusController {
  private bonusService: BonusService;

  constructor() {
    this.bonusService = new BonusService();
  }

  public async createBonus({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const bonus = await this.bonusService.createBonus(payload);
      return genericResponse({
        request,
        response,
        data: bonus,
        message: 'bonus created successfully',
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

  public async updateBonus({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const bonus = await this.bonusService.updateBonus(
        request.param('id'),
        payload
      );
      return genericResponse({
        request,
        response,
        data: bonus,
        message: 'bonus updated successfully',
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

  public async deleteBonus({ request, response }: HttpContext) {
    try {
      const bonus = await this.bonusService.deleteBonus(request.param('id'));
      return genericResponse({
        request,
        response,
        data: bonus,
        message: 'bonus deleted successfully',
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

  public async fetchBonusById({ request, response }: HttpContext) {
    try {
      const bonus = await this.bonusService.fetchBonusById(request.param('id'));
      return genericResponse({
        request,
        response,
        data: bonus,
        message: 'bonus fetched successfully',
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

  public async fetchBonusesByBusinessId({ request, response }: HttpContext) {
    try {
      const businessId = request.param('businessId');
      const page = Number(request.qs().page) || 1;
      const limit = Number(request.qs().limit) || 10;
      const bonuses = await this.bonusService.fetchBonusesByBusinessId(
        businessId,
        page,
        limit
      );
      return genericResponse({
        request,
        response,
        data: { data: bonuses.data, meta: bonuses.meta },
        message: 'Bonuses fetched successfully',
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
