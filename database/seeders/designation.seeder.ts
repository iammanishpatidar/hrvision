import Designation from '#app/designation/designation.model';
import { BaseSeeder } from '@adonisjs/lucid/seeders';

export default class DesignationSeeder extends BaseSeeder {
  async run() {
    await Designation.createMany([
      {
        designation: 'Chief Executive Officer (CEO)',
      },
      {
        designation: 'Chief Technology Officer (CTO)',
      },
      {
        designation: 'Chief Financial Officer (CFO)',
      },
      {
        designation: 'Vice President',
      },
      {
        designation: 'Director',
      },
      {
        designation: 'Senior Manager',
      },
      {
        designation: 'Manager',
      },
      {
        designation: 'Assistant Manager',
      },
      {
        designation: 'Team Lead',
      },
      {
        designation: 'Senior Software Engineer',
      },
      {
        designation: 'Software Engineer',
      },
      {
        designation: 'Junior Software Engineer',
      },
      {
        designation: 'Senior Frontend Developer',
      },
      {
        designation: 'Frontend Developer',
      },
      {
        designation: 'Senior Backend Developer',
      },
      {
        designation: 'Backend Developer',
      },
      {
        designation: 'Full Stack Developer',
      },
      {
        designation: 'DevOps Engineer',
      },
      {
        designation: 'Quality Assurance Engineer',
      },
      {
        designation: 'Business Analyst',
      },
      {
        designation: 'Product Manager',
      },
      {
        designation: 'Project Manager',
      },
      {
        designation: 'Scrum Master',
      },
      {
        designation: 'UI/UX Designer',
      },
      {
        designation: 'Data Scientist',
      },
      {
        designation: 'Data Analyst',
      },
      {
        designation: 'Database Administrator',
      },
      {
        designation: 'Systems Administrator',
      },
      {
        designation: 'Network Administrator',
      },
      {
        designation: 'Security Analyst',
      },
      {
        designation: 'Marketing Manager',
      },
      {
        designation: 'Sales Manager',
      },
      {
        designation: 'HR Manager',
      },
      {
        designation: 'HR Executive',
      },
      {
        designation: 'Finance Manager',
      },
      {
        designation: 'Accountant',
      },
      {
        designation: 'Administrative Assistant',
      },
      {
        designation: 'Receptionist',
      },
      {
        designation: 'Intern',
      },
      {
        designation: 'Trainee',
      },
    ]);
  }
} 