export interface BaseResponse<T> {
  data: T;
  isFailure: boolean;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export interface GetListResponse<T> {
  data: T[];
  isFailure: boolean;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: Page<T>;
  isFailure: boolean;
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

export interface Page<T> {
  items: T[];
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}