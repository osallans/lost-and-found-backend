class CityService {
  async createCity(cityData: CityDTO): Promise<CityDTO> {
    return cityData;
  }

  async getCityById(id: string): Promise<CityDTO | null> {
    return { id, name: 'New York', name_ar: 'نيويورك', country_code: 'US', created_at: new Date() };
  }

  async updateCity(id: string, cityData: Partial<CityDTO>): Promise<CityDTO | null> {
    return { id, ...cityData, created_at: new Date() };
  }

  async deleteCity(id: string): Promise<boolean> {
    return true;
  }
}

export default new CityService();
