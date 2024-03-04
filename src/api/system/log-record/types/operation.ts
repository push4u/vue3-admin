export interface ListReq extends Pagination {
  method?: string
  remark?: string
  ip?: string
}

export interface OperationLog extends IdTime {
  ip: string
  method: string
  path: string
  remark: string
  status: number
  latency: number
  agent: string
  error_message: string
  body: string
  resp: string
  user_id: number
  username: string
}
export type ListRes = Res<{
  list: OperationLog[]
  total: number
}>
