import { NotFoundException } from '@nestjs/common';

class IpAddressNotFoundException extends NotFoundException {
  constructor(ipAddressId: number) {
    super(`IpSetting with id ${ipAddressId} not found`);
  }
}

export default IpAddressNotFoundException;
