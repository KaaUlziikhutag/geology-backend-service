import { IsNumber, IsDefined, IsNotEmpty } from 'class-validator';

export class CreateDelegateOurDto {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  delegateId: number; // Delegate id

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  contractId: number; // Contract id
}

export default CreateDelegateOurDto;
