export class PageResponse<T> {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}
