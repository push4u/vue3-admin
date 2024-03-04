import { request } from "@/utils/service"

export interface Form {
  name: string
  description: string
  type: string
  status: boolean
}

export interface ListReq extends Pagination {
  created_by?: number
  hash?: string
  key?: string
  name?: string
  tag?: string
  url?: string
}

export interface File extends IdTime {
  url: string
  tag: string
  path: string
  name: string
  module: string
  key: string
  hash: string
  created_by: number
}
export type ListRes = Res<{
  list: File[]
  total: number
}>

export type Detail = Res<File>

// api路由公共前缀
export const apiPrefix = "/v1/admin/file"

/** 增 */
export function Create(data: Form & { dict_id: number }) {
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
  return request<File>({
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
  return request<File>({
    url: apiPrefix + "/" + id,
    method: "get"
  })
}
