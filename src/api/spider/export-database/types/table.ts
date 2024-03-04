export interface CreateTableRequestData {
  show_name: string
  host: string
  port: number
  user: string
  password: string
  db_name: string
}

export interface UpdateTableRequestData extends CreateTableRequestData {
  id: number
}

export interface GetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  page_size: number
  /** 查询参数：名称 */
  show_name?: string
  /** 查询参数：主机 */
  host?: string
}

export interface GetTableData {
  id: number
  show_name: string
  host: string
  port: number
  user: string
  password: string
  db_name: string
  created_at: string
  updated_at: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  count: number
}>
