import { request } from "@/utils/service"
import { DictDetail } from "@/api/system/dict-detail"

export interface Form {
  name?: string
  description?: string
  type?: string
  status?: boolean
}

export interface ListReq extends Pagination {
  keyword?: string
  status?: boolean
}

export interface Dict extends IdTime {
  name: string
  type: string
  status: boolean
  description: string
  dict_detail: DictDetail[]
}

export type ListRes = Res<{
  list: Dict[]
  total: number
}>

export type Detail = Res<Dict>

// api路由公共前缀
export const apiPrefix = "/v1/admin/dict"

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

// 字典使用时根据type获取字典id
export function GetByType(type: string) {
  return request<Detail>({
    url: apiPrefix + "Type/" + type,
    method: "get"
  })
}
