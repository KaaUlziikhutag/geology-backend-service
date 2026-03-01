import { NotFoundException } from '@nestjs/common';

class ApplicantGroupNotFoundException extends NotFoundException {
  constructor(applicantGroupId: number) {
    super(`applicantGroup with id ${applicantGroupId} not found`);
  }
}

export default ApplicantGroupNotFoundException;
