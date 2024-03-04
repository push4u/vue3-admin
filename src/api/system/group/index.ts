import { request } from "@/utils/service"

export interface Form {
  name?: string
  parent_id?: number
  sort?: number
  status?: number
}

export interface ListReq extends Pagination {
  status?: number
}

export interface Group extends IdTime {
  name: string
  parent_id: number
  sort: number
  status: number
  created_by: number
  children: Group[]
}

export type ListRes = Res<{
  list: Group[]
  total: number
}>

export type Detail = Res<Group>

// api路由公共前缀
export const apiPrefix = "/v1/admin/group"

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
