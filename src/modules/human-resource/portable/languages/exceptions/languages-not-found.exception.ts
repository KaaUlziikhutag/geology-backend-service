import { NotFoundException } from '@nestjs/common';

class LanguageNotFoundException extends NotFoundException {
  constructor(languageId: number) {
    super(`Language with id ${languageId} not found`);
  }
}

export default LanguageNotFoundException;
