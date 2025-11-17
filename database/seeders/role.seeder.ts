import Role from '#app/role/role.model';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class RoleSeeder extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        role: 'SUPER_ADMIN', // Someone who has access to all the organisations, employees and information.
      },
      {
        role: 'ADMIN', // Someone who has access to all employees and features in a particular organisation.
      },
      {
        role: 'MANAGER', // Someone who has access to all the employees who are reporting to them.
      },
      {
        role: 'EMPLOYEE', // Someone who only has access to their information.
      },
    ]);
  }
}
