import { HttpContext } from "@adonisjs/core/http";
import AssetRequestService from "./asset_request.service.js";
import AssetRequest from "./asset_request.model.js";
import snakecaseKeys from "snakecase-keys";
import { genericResponse } from "../../../utilities/response_handler.js";
import { commonRequestErrorHandler } from "../../../utilities/error_handler.js";
import asset_requestValidator from "./asset_request.validator.js";

export default class AssetRequestController {
    private assetRequestService: AssetRequestService

    constructor() {
        this.assetRequestService = new AssetRequestService()
    }
    

    public async createAssetRequest({ request, response }: HttpContext) {
        try {
            const payload = request.all();
            const { category_id, asset_types, employee_id, comments } = payload;

            await asset_requestValidator.fire({
                category_id,
                asset_types,
                employee_id,
                comments
            }, 'create');

            if (asset_types && Array.isArray(asset_types)) {
                const createdAssetRequests = await this.assetRequestService.createAssetRequest({
                    category_id,
                    asset_types,
                    employee_id,
                    comments
                });

                return genericResponse({
                    request,
                    response,
                    data: snakecaseKeys({
                        asset_requests: createdAssetRequests.map((ar: AssetRequest) => ar.toJSON())
                    }, { deep: true }),
                    message: 'Asset requests created successfully',
                });
            }
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

    public async getAssetRequests({ request, response }: HttpContext) {
        try {
            const payload = request.all();
            
            await asset_requestValidator.fire(payload, 'fetch');
            
            const {
                id,
                employee_id,
                category_id,
                status,
                page = '1',
                limit = '20'
            } = payload || {};

            const result = await this.assetRequestService.getAssetRequests({
                id,
                employee_id,
                category_id,
                status,
                page: parseInt(page),
                limit: parseInt(limit)
            });

            return genericResponse({
                request,
                response,
                data: snakecaseKeys({
                    asset_requests: result.asset_requests.map((ar: AssetRequest) => ar.toJSON()),
                    pagination: result.pagination
                }, { deep: true }),
                message: 'Asset requests fetched successfully'
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

    public async updateAssetRequest({ request, response, params }: HttpContext) {
        try {
            await asset_requestValidator.validateId(params.id);
            const payload = request.all();
            const assetRequest = {
                employee_id: payload.employee_id,
                asset_type: payload.asset_type,
                category_id: payload.category_id,
                status: payload.status,
                approved_by: payload.approved_by,
                approved_at: payload.approved_at,
                comments: payload.comments,
            } as Partial<AssetRequest>;

            await asset_requestValidator.fire(assetRequest, 'update');
            const updatedAssetRequest = await this.assetRequestService.updateAssetRequest(params.id, assetRequest);
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ asset_request: updatedAssetRequest.toJSON() }, { deep: true }),
                message: 'Asset request updated successfully',
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

    public async deleteAssetRequest({ request, response, params }: HttpContext) {
        try {
            await asset_requestValidator.validateId(params.id);
            await this.assetRequestService.deleteAssetRequest(params.id);
            return genericResponse({
                request,
                response,
                data: {},
                message: 'Asset request deleted successfully',
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

    public async approveAssetRequest({ request, response, params }: HttpContext) {
        try {
            await asset_requestValidator.validateId(params.id);
            const payload = request.all();
            const approveData = {
                approved_by: payload.approved_by,
                comments: payload.comments,
            };

            await asset_requestValidator.fire({ id: params.id, ...approveData }, 'approve');
            const approvedAssetRequest = await this.assetRequestService.approveAssetRequest(params.id, approveData);
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ asset_request: approvedAssetRequest.toJSON() }, { deep: true }),
                message: 'Asset request approved successfully',
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

    public async rejectAssetRequest({ request, response, params }: HttpContext) {
        try {
            await asset_requestValidator.validateId(params.id);
            const payload = request.all();
            const rejectData = {
                approved_by: payload.approved_by,
                comments: payload.comments,
            };

            await asset_requestValidator.fire({ id: params.id, ...rejectData }, 'reject');
            const rejectedAssetRequest = await this.assetRequestService.rejectAssetRequest(params.id, rejectData);
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ asset_request: rejectedAssetRequest.toJSON() }, { deep: true }),
                message: 'Asset request rejected successfully',
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