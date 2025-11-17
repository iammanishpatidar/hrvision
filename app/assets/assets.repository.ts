import Assets from "./assets.model.js"

export default class AssetsRepository {
  public async create(data: Partial<Assets>) {
    return Assets.create(data)
  }

  public async findById(id: string) {
    return Assets.find(id)
  }

  public async findAssetsWithPagination(
    criteria: {
      business_id: string;
      id?: string;
      category_id?: string;
    },
    page: number = 1,
    limit: number = 20
  ) {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const offset = (validatedPage - 1) * validatedLimit;

    let query = Assets.query().where('business_id', criteria.business_id);

    if (criteria.id) {
      query = query.where('id', criteria.id);
    }

    if (criteria.category_id) {
      query = query.where('category_id', criteria.category_id);
    }

    const totalQuery = query.clone();
    const total = await totalQuery.count('* as total').first();
    const totalCount = total?.$extras.total || 0;

    const assets = await query
      .preload('category')
      .offset(offset)
      .limit(validatedLimit)
      .orderBy('created_at', 'desc');

    return {
      assets,
      total: totalCount
    };
  }

  public async update(id: string, data: Partial<Assets>) {
    const asset = await Assets.find(id)
    if (!asset) {
      throw new Error('Asset not found')
    }
    return asset.merge(data).save()
  }

  public async delete(id: string) {
    const asset = await Assets.find(id)
    if (!asset) {
      throw new Error('Asset not found')
    }
     asset.delete()
  }

  public async findAssetTypesByCategoryId(categoryId: string) {
    if (!categoryId) {
      throw new Error('Category ID is required')
    }
    
    const assets = await Assets.query()
      .distinct('asset_type')
      .where('category_id', categoryId)
      .whereNull('deleted_at')
    
    return assets.map(asset => asset.asset_type)
  }
}