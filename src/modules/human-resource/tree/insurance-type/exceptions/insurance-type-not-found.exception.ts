import { NotFoundException } from '@nestjs/common';

class InsuranceTypeNotFoundException extends NotFoundException {
  constructor(insuranceTypeId: number) {
    super(`InsuranceType with id ${insuranceTypeId} not found`);
  }
}

export default InsuranceTypeNotFoundException;
