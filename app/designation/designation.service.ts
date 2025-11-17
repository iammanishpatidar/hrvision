import DesignationRepository from './designation.repository.js';
import CustomError from '../../utilities/custom_error.js';

export default class DesignationService {
  private designationRepository: DesignationRepository;

  constructor() {
    this.designationRepository = new DesignationRepository();
  }

  async getAllDesignations() {
    const designations = await this.designationRepository.findAll();
    return designations;
  }

  async getDesignationById(id: string) {
    const designation = await this.designationRepository.findById(id);
    if (!designation) {
      throw new CustomError('Designation not found', 404);
    }
    return designation;
  }
} 