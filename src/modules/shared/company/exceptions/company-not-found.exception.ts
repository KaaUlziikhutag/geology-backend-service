import { NotFoundException } from '@nestjs/common';

class CompanyNotFoundException extends NotFoundException {
  constructor(companyId: number) {
    super(`Company with id ${companyId} not found`);
  }
}

export default CompanyNotFoundException;
