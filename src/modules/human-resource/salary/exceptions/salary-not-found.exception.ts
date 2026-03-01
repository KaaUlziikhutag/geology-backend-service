import { NotFoundException } from '@nestjs/common';

class SalaryNotFoundException extends NotFoundException {
  constructor(salaryId: number) {
    super(`Salary with id ${salaryId} not found`);
  }
}

export default SalaryNotFoundException;
