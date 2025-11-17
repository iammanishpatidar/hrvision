import { HttpContext } from "@adonisjs/core/http";
import AssetsService from "./assets.service.js";
import { genericResponse } from "../../utilities/response_handler.js";
import { commonRequestErrorHandler } from "../../utilities/error_handler.js";
import assetsValidator from "./assets.validator.js";
import Assets from "./assets.model.js";
import snakecaseKeys from "snakecase-keys";

export default class AssetsController {
  private readonly assetsService: AssetsService;

  constructor() {
    this.assetsService = new AssetsService();
  }

  public async createAssets({ request, response }: HttpContext) {
    try {
      const payload = request.all();
      const asset = {
        name: payload.name,
        serial_number: payload.serial_number,
        business_id: payload.business_id,
        category_id: payload.category_id,
        assigned_date: payload.assigned_date,
        current_status: payload.current_status,
        asset_type: payload.asset_type,
        condition: payload.condition,
        warranty_expiry: payload.warranty_expiry,
        license_type: payload.license_type,
      } as Assets;

      await assetsValidator.fire(asset, 'create');
      const createdAsset = await this.assetsService.create(asset);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ asset: createdAsset.toJSON() }, { deep: true }),
        message: 'Asset created successfully',
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

  public async getAssets({ request, response }: HttpContext) {
    try {
      const { id, category_id, business_id, page = 1, limit = 20 } = request.all();
      await assetsValidator.fire({ id, category_id, business_id }, 'fetch');

      const result = await this.assetsService.getAssets({
        id,
        business_id,
        category_id,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      return genericResponse({
        request,
        response,
        data: snakecaseKeys(result.assets.map(asset => asset.toJSON()), { deep: true }),
        message: 'Fetch assets successfully'
      });
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message,
        error.statusCode,
        error
      );
    }
  }

  public async updateAssets({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      const payload = request.all() as Assets;
      await assetsValidator.fire(payload, 'update');
      const updatedAsset = await this.assetsService.update(id, payload);
      if (!updatedAsset) {
        return commonRequestErrorHandler(
          { request, response },
          'Asset not found or update failed.',
          404
        );
      }
      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ asset: updatedAsset.toJSON() }, { deep: true }),
        message: 'Asset updated successfully',
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

  public async deleteAssets({ request, response }: HttpContext) {
    try {
      const { id } = request.params();
      await assetsValidator.validateId(id);
      const deletedAsset = await this.assetsService.delete(id);
      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ asset: deletedAsset }, { deep: true }),
        message: `Asset deleted successfully ${id}`,
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

  public async getAssetTypes({ request, response }: HttpContext) {
    try {
      const { category_id } = request.params();
      await assetsValidator.fire({ category_id }, 'getAssetTypes');
      const assetTypes = await this.assetsService.getAssetTypes(category_id);
      if (assetTypes.length === 0) {
        return commonRequestErrorHandler(
          { request, response },
          'No asset types found',
          404
        );
      }
      return genericResponse({
        request,
        response,
        data: snakecaseKeys({ asset_types: assetTypes }, { deep: true }),
        message: 'Fetch asset types successfully'
      });
    } catch (error) {
      return commonRequestErrorHandler(
        { request, response },
        error.message,
        error.statusCode,
        error
      );
    }
  }
}