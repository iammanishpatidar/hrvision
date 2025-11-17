import CustomError from '../../utilities/custom_error.js';
import LocationRepository from './location.repository.js';
import locationValidator from './location.validator.js';
export default class LocationService {
  protected repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async fetchLocations(locationId: string) {
    await locationValidator.validateId(locationId);
    const locations = await this.repository.fetchLocation(locationId);
    if (!locations) {
      throw new CustomError('Location not found!', 400);
    }
    return locations;
  }
}
