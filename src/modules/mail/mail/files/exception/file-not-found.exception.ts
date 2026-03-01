import { NotFoundException } from '@nestjs/common';

class FileNotFoundException extends NotFoundException {
  constructor() {
    super(`File Not Found`);
  }
}

export default FileNotFoundException;
