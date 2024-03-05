import { request } from "@/utils/service"

import { File } from "@/api/system/file"
import { Group } from "@/api/system/group"
import { Role } from "@/api/system/role"

export interface Form {
  email?: string
  group_id?: number
  nickname?: string
  confirm_password?: string
  password?: string
  phone?: string
  sex?: number
  roles?: number[]
  username?: string
  avatar?: number
  avatar_file?: File | null
  option?: UserOption | null
}

export interface FormMy {
  email?: string
  nickname?: string
  phone?: string
  avatar?: number
  avatar_file?: File | null
  option?: UserOption | null
}

export interface ListReq extends Pagination {
  group_id?: number
  role_id?: number
  keyword?: string
}

export interface User extends IdTime {
  avatar: number
  avatar_file: File | null
  created_by: number
  email: string
  group_id: number
  group: Group | null
  nickname: string
  option: UserOption | null
  parent_id: string
  path: string
  phone: string
  remark: string
  roles: Role[] | null
  sex: number
  status: string
  username: string
  roleDataForDisplay?: string
  groupDataForDisplay?: string
}
export interface UserOption {
  default_router: string
}

export type ListRes = Res<{
  list: User[]
  total: number
}>

export type Detail = Res<User>

// api路由公共前缀
export const apiPrefix = "/v1/admin/user"

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
