import bonusValidator from './bonus.validator.js';
import CustomError from '../../utilities/custom_error.js';
import Bonus from './bonus.model.js';
import BonusRepository from './bonus.repository.js';

export default class BonusService {
  private repository: BonusRepository;
  constructor() {
    this.repository = new BonusRepository();
  }

  async createBonus(payload: Partial<Bonus>): Promise<Bonus> {
    await bonusValidator.fire(payload, 'create');
    const bonus = await this.repository.create(payload);
    return bonus;
  }

  async updateBonus(id: string, payload: Partial<Bonus>): Promise<Bonus> {
    await bonusValidator.fire(payload, 'update');
    const updatedBonus = await this.repository.update(id, payload);
    if (!updatedBonus) {
      throw new CustomError('Bonus not found', 400);
    }
    return updatedBonus;
  }

  async deleteBonus(id: string): Promise<boolean> {
    const deleteBonus = await this.repository.delete(id);
    if (!deleteBonus) {
      throw new CustomError('Bonus not found', 400);
    }
    return true;
  }

  async fetchBonusById(id: string): Promise<Bonus> {
    const bonus = await this.repository.findById(id);
    if (!bonus) {
      throw new CustomError('Bonus not found', 400);
    }
    return bonus;
  }

  async fetchBonusesByBusinessId(
    id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: Bonus[];
    meta: { total: number; page: number; limit: number };
  }> {
    const bonuses = await this.repository.findByField(
      'business_id',
      id,
      page,
      limit
    );
    if (!bonuses.data.length) {
      throw new CustomError('No bonuses found for the given business ID', 400);
    }

    return bonuses;
  }
}
