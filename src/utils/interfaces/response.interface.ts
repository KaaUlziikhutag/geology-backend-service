export interface IResponse {
  success: boolean;
  message: string;
  response: unknown[];
  statusCode: number;
}
