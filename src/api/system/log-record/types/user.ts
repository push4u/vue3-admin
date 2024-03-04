export interface ListReq extends Pagination {
  method?: string
  username?: string
  operator_name?: string
  action?: string
  data_id?: number
  data_name?: string
  diff?: string
  ip?: string
  content?: string
  data_type?: string
}

export interface UserLog extends IdTime {
  ip: string
  method: string
  path: string
  status: number
  operator_id: number
  operator_name: string
  action: string
  data_type: string
  data_id: number
  data_name: string
  diff: string
  content: string
}
export type ListRes = Res<{
  list: UserLog[]
  total: number
}>
