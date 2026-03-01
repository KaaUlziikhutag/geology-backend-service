import { NotFoundException } from '@nestjs/common';

class ApplicantNotFoundException extends NotFoundException {
  constructor(applicantId: number) {
    super(`Applicant with id ${applicantId} not found`);
  }
}

export default ApplicantNotFoundException;
