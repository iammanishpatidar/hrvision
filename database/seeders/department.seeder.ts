import Department from '#app/department/department.model';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class DepartmentSeeder extends BaseSeeder {
  async run() {
    await Department.createMany([
      {
        department: 'Human Resources',
      },
      {
        department: 'Engineering',
      },
      {
        department: 'Sales',
      },
      {
        department: 'Marketing',
      },
      {
        department: 'Finance',
      },
      {
        department: 'Operations',
      },
      {
        department: 'Customer Support',
      },
      {
        department: 'Product Management',
      },
      {
        department: 'Quality Assurance',
      },
      {
        department: 'Legal',
      },
      {
        department: 'Information Technology',
      },
      {
        department: 'Research & Development',
      },
      {
        department: 'Business Development',
      },
      {
        department: 'Administration',
      },
      {
        department: 'Procurement',
      },
    ]);
  }
} 