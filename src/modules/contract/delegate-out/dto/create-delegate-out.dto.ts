import { IsNumber, IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateDelegateOutDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  delegateName: string; // Delegate name

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  contractId: number; // Contract id
}

export default CreateDelegateOutDto;
