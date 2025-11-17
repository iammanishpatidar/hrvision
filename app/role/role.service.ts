import RoleRepository from './role.repository.js';
import CustomError from '../../utilities/custom_error.js';

export default class RoleService {
  private roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = new RoleRepository();
  }

  async getAllRoles() {
    const roles = await this.roleRepository.findAll();
    return roles;
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new CustomError('Role not found', 404);
    }
    return role;
  }
} 