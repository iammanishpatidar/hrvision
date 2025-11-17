import AssetRequestRepository from "./asset_request.repository.js";
import AssetRequest from "./asset_request.model.js";
import CustomError from "../../../utilities/custom_error.js";
import Employee from "#app/employee/employee.model";
import Category from "#app/category/category.model";

export default class AssetRequestService {
  private assetRequestRepository: AssetRequestRepository
  constructor() {
    this.assetRequestRepository = new AssetRequestRepository()
  }

  public async getAssetRequests(params: {
    id?: string;
    employee_id?: string;
    category_id?: string;
    status?: string;
    page: number;
    limit: number;
  }) {
    const { id, employee_id, category_id, status, page, limit } = params;

    const queryCriteria: any = {};
    
    if (id) {
      queryCriteria.id = id;
    }
    
    if (employee_id) {
      queryCriteria.employee_id = employee_id;
    }
    
    if (category_id) {
      queryCriteria.category_id = category_id;
    }
    
    if (status) {
      queryCriteria.status = status;
    }

    const result = await this.assetRequestRepository.findAssetRequestsWithPagination(
      queryCriteria,
      page,
      limit
    );

    return {
      asset_requests: result.asset_requests,
      pagination: {
        page,
        limit,
        total: result.total,
        total_pages: Math.ceil(result.total / limit)
      }
    };
  }

  public async updateAssetRequest(id: string, data: Partial<AssetRequest>) {
    return this.assetRequestRepository.update(id, data)
  }

  public async deleteAssetRequest(id: string) {
    return this.assetRequestRepository.delete(id)
  }

  public async approveAssetRequest(id: string, data: { approved_by: string; comments?: string }) {
    return this.assetRequestRepository.approve(id, data)
  }

  public async rejectAssetRequest(id: string, data: { approved_by: string; comments?: string }) {
    return this.assetRequestRepository.reject(id, data)
  }

  public async createAssetRequest(data: {
    category_id: string;
    asset_types: string[];
    employee_id: string;
    comments?: string;
  }) {
    const assetRequests = [];
    const category = await Category.find(data.category_id)
    if (!category) {
      throw new CustomError('Category not found', 404)
    }
    const employee = await Employee.find(data.employee_id)
    if (!employee) {
      throw new CustomError('Employee not found', 404)
    }
    if (data.asset_types.length === 0) {
      throw new CustomError('Asset types are required', 400)
    }

    const existingPendingRequests = await this.assetRequestRepository.findPendingRequests({
      employee_id: data.employee_id,
      category_id: data.category_id,
      asset_types: data.asset_types
    })

    if (existingPendingRequests.length > 0) {
      const duplicateAssetTypes = existingPendingRequests.map((req: AssetRequest) => req.asset_type)
      throw new CustomError(
        `You already have pending requests for these asset types: ${duplicateAssetTypes.join(', ')}`,
        400
      )
    }

    for (const asset_type of data.asset_types) {
      const assetRequest = await this.assetRequestRepository.create({
        employee_id: data.employee_id,
        asset_type: asset_type,
        category_id: data.category_id,
        status: 'PENDING',
      });
      
      assetRequests.push(assetRequest);
    }

    
    return assetRequests;
  }
}