export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  isActive: boolean;
  dataBase: string;
}

export default IUser;
