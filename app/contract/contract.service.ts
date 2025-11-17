import CustomError from "../../utilities/custom_error.js";
import Contract from "./contract.model.js";
import ContractRepository from "./contract.repository.js";
import { contractValidator } from "./contract.validator.js";
import EmployeeRepository from "../employee/employee.repository.js";

export default class ContractService {
  private repository: ContractRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.repository = new ContractRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  public async createContract(data: Partial<Contract>): Promise<Contract> {
    await contractValidator.fire(data, "create");
    if (!data.employee_id) {
      throw new CustomError('Employee ID is required', 400);
    }
    const employee = await this.employeeRepository.findById(data.employee_id);
    if (!employee) {
      throw new CustomError('Employee not found', 400);
    }
    const newContract = await this.repository.createContract(data);
    return newContract;
  }

  public async fetchContractsByBusiness(businessId: string): Promise<Contract[]> {
    if (!businessId) {
      throw new CustomError("Business ID is required", 400);
    }
    const contracts = await this.repository.fetchContractsByBusiness(businessId);
    if (!contracts || contracts.length === 0) {
      throw new CustomError("No contracts found for this business", 404);
    }
    return contracts;
  }

  public async fetchContractById(id: string): Promise<Contract> {
    await contractValidator.validateId(id);
    const contract = await this.repository.fetchContractById(id);
    if (!contract) {
      throw new CustomError("Contract not found", 404);
    }
    return contract;
  }

  public async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    await contractValidator.fire(data, "update");
    const updatedContract = await this.repository.updateContract(id, data);
    if (!updatedContract) {
      throw new CustomError("Contract not found or update failed", 404);
    }
    if (!id) {
      throw new CustomError("Invalid contract_id provided", 400);
    }
    return updatedContract;
  }

  public async deleteContract(id: string): Promise<boolean> {
    await contractValidator.fire({ id }, "delete");
    const deletedContract = await this.repository.deleteContract(id);
    if (!deletedContract) {
      throw new CustomError("Contract not found or delete failed", 404);
    }
    return true;
  }
}
