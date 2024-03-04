export interface ListReq extends Pagination {
  username?: string
  status?: boolean
  ip?: string
  keyword?: string
}

export interface LoginLog extends IdTime {
  browser: string
  ip: string
  msg: string
  os: string
  platform: string
  remark: string
  status: boolean
  username: string
}
export type ListRes = Res<{
  list: LoginLog[]
  total: number
}>
