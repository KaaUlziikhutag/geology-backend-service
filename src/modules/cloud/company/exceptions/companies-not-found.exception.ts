import { NotFoundException } from '@nestjs/common';

class CompaniesNotFoundException extends NotFoundException {
  constructor(companiesId: number) {
    super(`Companies with id ${companiesId} not found`);
  }
}

export default CompaniesNotFoundException;
