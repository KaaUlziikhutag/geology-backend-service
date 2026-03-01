import { NotFoundException } from '@nestjs/common';

class EmploymentContractNotFoundException extends NotFoundException {
  constructor(employmentContractId: number) {
    super(`EmploymentContract with id ${employmentContractId} not found`);
  }
}

export default EmploymentContractNotFoundException;
