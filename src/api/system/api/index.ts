import { request } from "@/utils/service"

export interface Form {
  api_group?: string
  description?: string
  is_need_login?: boolean
  is_need_permission?: boolean
  is_write_log?: boolean
  method?: string
  path?: string
}

export interface ListReq extends Pagination {
  path?: string
  description?: string
  api_group?: string
  is_write_log?: boolean
  is_need_login?: boolean
  is_need_permission?: boolean
  method?: string
}

export interface Api extends IdTime {
  api_group: string
  description: string
  is_need_login: boolean
  is_need_permission: boolean
  is_write_log: boolean
  method: string
  path: string
}

export type ListRes = Res<{
  list: Api[]
  total: number
}>

export type Detail = Res<Api>

// api路由公共前缀
export const apiPrefix = "/v1/admin/apm"

/** 增 */
export function Create(data: Form) {
  return request<Detail>({
    url: apiPrefix,
    method: "post",
    data
  })
}

/** 删 */
export function Delete(data: { id: number[] }) {
  return request<DeleteRes>({
    url: apiPrefix,
    method: "delete",
    data
  })
}

/** 改 */
export function Update(id: number, data: Form) {
  return request<Detail>({
    url: apiPrefix + "/" + id,
    method: "put",
    data
  })
}

/** 查 */
export function List(params: ListReq) {
  return request<ListRes>({
    url: apiPrefix,
    method: "get",
    params
  })
}

// 编辑时查详细内容
export function Get(id: number) {
  return request<Detail>({
    url: apiPrefix + "/" + id,
    method: "get"
  })
}
