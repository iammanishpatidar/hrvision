
import Category from "./category.model.js";
import CategoryRepository from "./category.repository.js";

export default class CategoryService {
    private readonly categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.findAll();
    }
}   