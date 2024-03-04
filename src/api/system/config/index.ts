import { request } from "@/utils/service"

export interface Form {
  key?: string
  label?: string
  value?: string
  type?: string
  remark?: string
}

export interface ListReq extends Pagination {
  label?: string
  key?: string
  value?: string
  type?: string
  remark?: string
}

export interface Config {
  created_by: number
  key: string
  label: string
  remark: string
  type: string
  updated_by: number
  value: string
}

export type ListRes = Res<{
  list: Config[]
  total: number
}>

export type Detail = Res<Config>

// api路由公共前缀
export const apiPrefix = "/v1/admin/config"

/** 增 */
export function Create(data: Form) {
  return request<Detail>({
    url: apiPrefix,
    method: "post",
    data
  })
}

/** 删 */
export function Delete(data: { key: string[] }) {
  return request<DeleteRes>({
    url: apiPrefix,
    method: "delete",
    data
  })
}

/** 改 */
export function Update(key: string, data: Form) {
  return request<Detail>({
    url: apiPrefix + "/" + key,
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
export function Get(key: string) {
  return request<Detail>({
    url: apiPrefix + "/" + key,
    method: "get"
  })
}
