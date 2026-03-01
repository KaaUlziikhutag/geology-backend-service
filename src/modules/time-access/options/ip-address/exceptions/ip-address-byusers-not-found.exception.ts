import { NotFoundException } from '@nestjs/common';

class IpAddressByUsersNotFoundException extends NotFoundException {
  constructor(ipAddressId: number) {
    super(`IpByUsers ip address ${ipAddressId} not found`);
  }
}

export default IpAddressByUsersNotFoundException;
