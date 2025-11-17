import JobTitle from './job_titles.models.js';
import JobTitleRepository from './job_titles.repository.js';
import jobTitleValidator from './job_titles.validator.js';
import CustomError from '../../utilities/custom_error.js';
import BusinessRepository from '../business/business.repository.js';

export default class JobTitleService {
  private repository: JobTitleRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.repository = new JobTitleRepository();
    this.businessRepository = new BusinessRepository();
  }

  async createJobTitle(payload: {
    title: string;
    description: string;
    business_id: string;
  }): Promise<JobTitle> {
    await jobTitleValidator.fire(payload, 'create');
    const findBusiness = await this.businessRepository.findById(
      payload.business_id
    );
    if (!findBusiness) {
      throw new CustomError('Business not found', 404);
    }
    const existingJobTitle = await this.repository.findByTitle(
      payload.title,
      payload.business_id
    );

    if (existingJobTitle) {
      throw new CustomError(
        `A job title with the name "${payload.title}" already exists in this business`,
        400
      );
    }

    const jobTitle = await this.repository.create(payload);
    return jobTitle;
  }

  async updateJobTitle(
    id: string,
    payload: Partial<{ title: string; description: string }>
  ): Promise<JobTitle> {
    await jobTitleValidator.validateId(id);
    await jobTitleValidator.fire(payload, 'update');

    const existingJobTitle = await this.repository.findById(id);
    if (!existingJobTitle) {
      throw new CustomError('Job title not found', 404);
    }

    if (payload.title && payload.title !== existingJobTitle.title) {
      const duplicateJobTitle = await this.repository.findByTitle(
        payload.title,
        existingJobTitle.business_id
      );

      if (duplicateJobTitle) {
        throw new CustomError(
          `A job title with the name "${payload.title}" already exists in this business`,
          400
        );
      }
    }

    const updatedJobTitle = await this.repository.update(id, payload);
    if (!updatedJobTitle) {
      throw new CustomError('Failed to update job title', 400);
    }

    return updatedJobTitle;
  }

  async deleteJobTitle(id: string): Promise<boolean> {
    await jobTitleValidator.validateId(id);

    const existingJobTitle = await this.repository.findById(id);
    if (!existingJobTitle) {
      throw new CustomError('Job title not found', 404);
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new CustomError('Failed to delete job title', 400);
    }

    return true;
  }

  async fetchJobTitles(
    business_id: string,
    job_title_id?: string
  ): Promise<JobTitle | JobTitle[]> {
    const foundBusiness = await this.businessRepository.findById(business_id);
    if (!foundBusiness) {
      throw new CustomError('Business not found', 400);
    }
    if (job_title_id) {
      const jobTitle = await this.repository.findById(job_title_id);
      if (!jobTitle || jobTitle.business_id !== business_id) {
        throw new CustomError('Job title not found for this business', 400);
      }
      return jobTitle;
    }
    const jobTitles = await this.repository.findByBusinessId(business_id);
    return jobTitles;
  }
}
