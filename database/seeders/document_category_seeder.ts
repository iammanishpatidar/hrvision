import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DocumentCategory from '../../app/documentCategory/documentCategory.model.js'

export default class extends BaseSeeder {
  async run() {
    await DocumentCategory.createMany([
          { name: 'Employment-Related Documents' },
          { name: 'Policy & Compliance Documents' },
          { name: 'Identity & Verification Documents' },
          { name: 'Educational & Professional Documents' },
          { name: 'Salary & Tax Documents' },
          { name: 'Health & Insurance Documents' },
          { name: 'Other Documents' },
        ]);
  }
}