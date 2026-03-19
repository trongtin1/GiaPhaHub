export interface QueryResourceRequest {
  sortColumnBy?: string;
  isSortColumnAscending?: boolean;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}
