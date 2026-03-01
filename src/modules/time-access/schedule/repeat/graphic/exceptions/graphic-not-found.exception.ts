import { NotFoundException } from '@nestjs/common';

class GraphicNotFoundException extends NotFoundException {
  constructor(graphicId: number) {
    super(`Graphic with id ${graphicId} not found`);
  }
}

export default GraphicNotFoundException;
