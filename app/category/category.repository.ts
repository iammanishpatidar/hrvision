import Category from "./category.model.js";

export default class CategoryRepository {
    private readonly categoryModel: typeof Category;

    constructor() {
        this.categoryModel = Category;
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.query().orderBy('createdAt', 'desc');
    }
}
