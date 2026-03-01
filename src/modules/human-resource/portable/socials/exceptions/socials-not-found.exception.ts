import { NotFoundException } from '@nestjs/common';

class SocialsNotFoundException extends NotFoundException {
  constructor(socialsId: number) {
    super(`Socials with id ${socialsId} not found`);
  }
}

export default SocialsNotFoundException;
