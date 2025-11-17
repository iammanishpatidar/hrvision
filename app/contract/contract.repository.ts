import Contract from "./contract.model.js";

export default class ContractService {
    async createContract(data: Partial<Contract>): Promise<Contract> {
        return await Contract.create(data);
    }

    async fetchContractsByBusiness(businessId: string): Promise<Contract[]> {
        return await Contract.query()
        .whereHas("employee", (employeeQuery) => {
            employeeQuery.where("business_id", businessId);
        })
        .preload("employee");
    }

    async fetchContractById(id: string): Promise<Contract | null> {
        return await Contract.find(id);
    }

    async updateContract(id: string, data: Partial<Contract>): Promise<Contract | null> {
        const contract = await Contract.find(id);
        if (!contract) {
            return null;
        }
        return await contract.merge(data).save();
    }

    async deleteContract(id: string): Promise<boolean> {
       const ContractDelete = await Contract.find(id);
       if (ContractDelete) {
         await ContractDelete.delete();
         return true;
       }
       return false;
     }
   
    
}