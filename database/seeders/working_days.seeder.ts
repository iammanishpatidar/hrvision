import WorkingDay from '../../app/workingdays/working_days.model.js';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class WorkingDaySeeder extends BaseSeeder {
  async run() {
    await WorkingDay.createMany([
      { day: 'Monday' },
      { day: 'Tuesday' },
      { day: 'Wednesday' },
      { day: 'Thursday' },
      { day: 'Friday' },
      { day: 'Saturday' },
      { day: 'Sunday' },
    ]);
  }
}
