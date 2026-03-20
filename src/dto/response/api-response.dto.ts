export class ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}
