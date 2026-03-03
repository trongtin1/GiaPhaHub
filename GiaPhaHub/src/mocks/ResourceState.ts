export interface ResourceState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}