import { request } from "@/utils/service"
import { Group } from "@/api/system/group"
import { Api } from "@/api/system/api"
import { User } from "@/api/system/user"

export interface Form {
  name: string
  group_id: number[]
  api_id: number[]
}

export interface ListReq extends Pagination {
  name?: string
  group_id?: string
}

export interface Role extends IdTime {
  created_by: number
  group_id: number
  name: string
  parent_id: number
  path: string
  sort: number
  status: number
  user: User[] | null
  groups: Group[] | null
  apis: Api[] | null
  children: Role[] | null
}

export type ListRes = Res<{
  list: Role[]
  total: number
}>

export type Detail = Res<Role>

// api路由公共前缀
export const apiPrefix = "/v1/admin/role"

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
  return request({
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
