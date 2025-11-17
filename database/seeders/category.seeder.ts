import Category from "#app/category/category.model";
import { BaseSeeder } from "@adonisjs/lucid/seeders";

export default class CategorySeeder extends BaseSeeder {

    async run() {

        await Category.createMany([
            {
                name: 'HARDWARE',
            },
            {
                name: 'SOFTWARE',
            },
            {
                name: 'OFFICE_EQUIPMENT',
            },
            {
                name: 'MISCELLANEOUS',
            },
        ]);
    }
}