export interface CreateTableRequestData {
  username: string
  password: string
}

export interface UpdateTableRequestData {
  id: string
  username: string
  password?: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  page_size: number
  birthday: string
  carModelNo: string
  carNumber: string
  fix: string
  insuranceEndAt: string
  km: number
  name: string
  phone: string
  refer: string
}

export interface GetTableData {
  birthday: string
  carModelNo: string
  carNumber: string
  fix: string
  id: number
  createdAt: string
  insuranceEndAt: string
  km: number
  name: string
  phone: string
  refer: string
  updatedAt: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  total: number
}>
