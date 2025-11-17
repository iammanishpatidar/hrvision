import AssetRequest from "./asset_request.model.js";
import { DateTime } from "luxon";

export default class AssetRequestRepository {
  public async create(data: Partial<AssetRequest>) {
    return AssetRequest.create(data)
  }

  public async findAssetRequestsWithPagination(
    criteria: {
      id?: string;
      employee_id?: string;
      category_id?: string;
      status?: string;
    },
    page: number = 1,
    limit: number = 20
  ) {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const offset = (validatedPage - 1) * validatedLimit;

    let query = AssetRequest.query();
    
    // Build query dynamically based on provided criteria
    if (criteria.id) {
      query = query.where('asset_requests.id', criteria.id);
    }

    if (criteria.employee_id) {
      query = query.where('asset_requests.employee_id', criteria.employee_id);
    }

    if (criteria.category_id) {
      query = query.where('asset_requests.category_id', criteria.category_id);
    }

    if (criteria.status) {
      query = query.where('asset_requests.status', criteria.status);
    }

    const totalQuery = query.clone();
    const total = await totalQuery.count('asset_requests.id as total').first();
    const totalCount = total?.$extras.total || 0;

    const assetRequests = await query
      .preload('employee')
      .preload('category')
      .offset(offset)
      .limit(validatedLimit)
      .orderBy('asset_requests.created_at', 'desc');

    return {
      asset_requests: assetRequests,
      total: totalCount
    };
  }

  public async update(id: string, data: Partial<AssetRequest>) {
    const assetRequest = await AssetRequest.find(id)
    if (!assetRequest) {
      throw new Error('Asset request not found')
    }
    return assetRequest.merge(data).save()
  }

  public async delete(id: string) {
    const assetRequest = await AssetRequest.find(id)
    if (!assetRequest) {
      throw new Error('Asset request not found')
    }
    assetRequest.delete()
  }
  
  public async updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const assetRequest = await AssetRequest.find(id)
    if (!assetRequest) {
      throw new Error('Asset request not found')
    }
    
    assetRequest.status = status
    return assetRequest.save()
  }

  public async approve(id: string, data: { approved_by: string; comments?: string }) {
    const assetRequest = await AssetRequest.find(id)
    if (!assetRequest) {
      throw new Error('Asset request not found')
    }
    
    assetRequest.status = 'APPROVED'
    assetRequest.approved_by = data.approved_by
    assetRequest.approved_at = DateTime.now()
    return assetRequest.save()
  }

  public async reject(id: string, data: { approved_by: string; comments?: string }) {
    const assetRequest = await AssetRequest.find(id)
    if (!assetRequest) {
      throw new Error('Asset request not found')
    }
    
    assetRequest.status = 'REJECTED'
    assetRequest.approved_by = data.approved_by
    assetRequest.approved_at = DateTime.now()
    
    return assetRequest.save()
  }

  public async findPendingRequests(data: {
    employee_id: string;
    category_id: string;
    asset_types: string[];
  }) {
    return AssetRequest.query()
      .where('employee_id', data.employee_id)
      .where('category_id', data.category_id)
      .where('status', 'PENDING')
      .whereIn('asset_type', data.asset_types)
      .whereNull('deleted_at')
  }
}