import { NotFoundException } from '@nestjs/common';

class CountryNotFoundException extends NotFoundException {
  constructor(countryDictionaryId: number) {
    super(`CountryDictionary with id ${countryDictionaryId} not found`);
  }
}

export default CountryNotFoundException;
