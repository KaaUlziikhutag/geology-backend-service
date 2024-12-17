class InvoiceItemDto {
  description: string;
  quantity: number;
  amount: number;
}
class BankAccount {
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
}
interface IInvoice {
  logo: string;
  code: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  companyName: string;
  companyAddress: string;
  companyRegno: string;
  companyPhone: string;
  companyEmail: string;
  total: number;
  bankAccounts: BankAccount[];
  items: InvoiceItemDto[];
}
export default IInvoice;
