import Location from './location.model.js';

export default class LocationRepository {
  async fetchLocation(locationId: string): Promise<Location | null> {
    return await Location.find(locationId);
  }
}
