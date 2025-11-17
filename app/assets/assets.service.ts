import Business from "#app/business/business.model";
import Assets from "./assets.model.js";
import AssetsRepository from "./assets.repository.js";
import Category from "../category/category.model.js";
import CustomError from "../../utilities/custom_error.js";

export default class AssetsService {
  private readonly assetsRepository: AssetsRepository;

  constructor() {
    this.assetsRepository = new AssetsRepository();
  }

  public async create(data: Partial<Assets>) {
    const business = await Business.find(data.business_id)
    if (!business) {
      throw new CustomError('Business not found', 404)
    }
    const category = await Category.find(data.category_id)
    if (!category) {
      throw new CustomError('Category not found', 404)
    }

    if (category.name === 'HARDWARE' && data.serial_number) {
      const existingAsset = await Assets.query()
        .where('asset_type', 'HARDWARE')
        .where('serial_number', data.serial_number)
        .whereNull('deleted_at')
        .first()

      if (existingAsset) {
        throw new CustomError('Hardware asset with this serial number already exists', 400)
      }
    }

    return this.assetsRepository.create(data)
  }

  public async getAssets(params: {
    id?: string;
    business_id: string;
    category_id?: string;
    page: number;
    limit: number;
  }) {
    const { id, business_id, category_id, page, limit } = params;

    const queryCriteria: any = { business_id };
    const business = await Business.find(business_id)
    if (!business) {
      throw new CustomError('Business not found', 404)
    }
    if (id) {
      queryCriteria.id = id;
    }



    if (category_id) {
      const category = await Category.find(category_id)
      if (!category) {
        throw new CustomError('Category not found', 404)
      }
      queryCriteria.category_id = category_id;
    }

    const result = await this.assetsRepository.findAssetsWithPagination(
      queryCriteria,
      page,
      limit
    );


    if (result.assets.length === 0) {
      throw new CustomError('No assets found', 404)
    }

    return {
      assets: result.assets,
      pagination: {
        page,
        limit,
        total: result.total,
        total_pages: Math.ceil(result.total / limit)
      }
    };
  }

  public async update(id: string, data: Partial<Assets>) {
    const asset = await Assets.find(id)
    if (!asset) {
      throw new CustomError('Asset not found', 404)
    }

    if (asset.business_id !== data.business_id) {
      throw new CustomError('You are not authorized to update this asset', 403)
    }

    const category = await Category.find(data.category_id)
    if (!category) {
      throw new CustomError('Category not found', 404)
    }

    const business = await Business.find(data.business_id)
    if (!business) {
      throw new CustomError('Business not found', 404)
    }

    if (category.name === 'HARDWARE' && data.serial_number) {
      const existingAsset = await Assets.query()
        .where('asset_type', 'HARDWARE')
        .where('serial_number', data.serial_number)
        .where('id', '!=', id)
        .whereNull('deleted_at')
        .first()

      if (existingAsset) {
        throw new CustomError('Hardware asset with this serial number already exists', 400)
      }
    }

    return this.assetsRepository.update(id, data)
  }

  public async delete(id: string) {
    return this.assetsRepository.delete(id)
  }

  public async getAssetTypes(category_id: string) {
    return this.assetsRepository.findAssetTypesByCategoryId(category_id)
  }

}