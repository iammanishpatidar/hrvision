import CompanyPolicy from './policy.model.js';
import CompanyPolicyRepository from './policy.repository.js';
import { uploadFileToS3 } from '../../utilities/file_upload.utilities.js';
import CustomError from '../../utilities/custom_error.js';

export default class CompanyPolicyService {
  private companyPolicyRepository: CompanyPolicyRepository;
  constructor() {
    this.companyPolicyRepository = new CompanyPolicyRepository();
  }

  async create(file: any, payload: Partial<CompanyPolicy>) {
    if (!file) {
      throw new CustomError('Policy file is required', 500);
    }
    const uploadedFileUrl = await uploadFileToS3(file);
    const created = await this.companyPolicyRepository.create({
      ...payload,
      file_path: uploadedFileUrl,
    });

    return created;
  }

  async getById(id: string) {
    const policy = await this.companyPolicyRepository.findById(id);
    if (!policy) {
      throw new CustomError('Policy not found', 400);
    }
    return policy;
  }

  async getByBusinessId(businessId: string) {
    return await this.companyPolicyRepository.findByBusinessId(businessId);
  }

  async update(
    id: string,
    businessId: string,
    payload: Partial<CompanyPolicy>
  ) {
    const policy = await this.companyPolicyRepository.update(id, payload);
    if (!policy || policy.business_id != businessId) {
      throw new CustomError('Policy not found', 400);
    }
    return await this.companyPolicyRepository.update(id, payload);
  }

  async listAll() {
    return await this.companyPolicyRepository.all();
  }
}
