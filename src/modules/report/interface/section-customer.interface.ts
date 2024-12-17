interface IReportCustomer {
  id: number;
  name: string;
  monthQty: number;
  monthAmount: number;
  yearQty: number;
  yearAmount: number;
}
export default interface ISectionCustomer {
  id: number;
  code: string;
  name: string;
  customers: IReportCustomer[];
  monthQty: number;
  monthAmount: number;
  yearQty: number;
  yearAmount: number;
}
