export interface APIResponse<T> {
  headers: Headers;
  okay: boolean;
  data: T;
}

export interface PaginatedAPIResponse<T> extends APIResponse<T> {
  nextPage?: number,
  currentPage: number,
  previousPage?: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number
}
