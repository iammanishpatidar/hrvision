import { HttpContext } from "@adonisjs/core/http";
import CategoryService from "./category.service.js";
import { genericResponse } from "../../utilities/response_handler.js";
import snakecaseKeys from "snakecase-keys";
import { commonRequestErrorHandler } from "../../utilities/error_handler.js";
import Category from "./category.model.js";

export default class CategoryController {
    private readonly categoryService: CategoryService;
    constructor() {
        this.categoryService = new CategoryService();
    }
    async fetch({ request, response }: HttpContext) {
        try {
            const categories = await this.categoryService.findAll();
            return genericResponse({
                request,
                response,
                data: snakecaseKeys({ categories: categories.map((category: Category) => category.toJSON()) }, { deep: true }),
                message: 'Categories fetched successfully',
            });
        } catch (error) {
            return commonRequestErrorHandler({ request, response }, error.message, error.statusCode, error);
        }
    }
}   