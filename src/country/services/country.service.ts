class CountryService {
  async createCountry(countryData: CountryDTO): Promise<CountryDTO> {
    return countryData;
  }

  async getCountryByCode(code: string): Promise<CountryDTO | null> {
    return { code, name: 'United States', name_ar: 'الولايات المتحدة', created_at: new Date() };
  }

  async updateCountry(code: string, countryData: Partial<CountryDTO>): Promise<CountryDTO | null> {
    return { code, ...countryData, created_at: new Date() };
  }

  async deleteCountry(code: string): Promise<boolean> {
    return true;
  }
}

export default new CountryService();
