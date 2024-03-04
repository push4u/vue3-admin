import { request } from "@/utils/service"

export interface Form {
  label?: string
  value?: string
  sort?: number
  status?: boolean
}

export interface FormCreate extends Form {
  dict_id: number
}

export interface ListReq extends Pagination {
  dict_id: number
  keyword?: string
  status?: boolean
}

export interface DictDetail extends IdTime {
  dict_id: number
  label: string
  sort: number
  status: boolean
  value: string
}

export type ListRes = Res<{
  list: DictDetail[]
  total: number
}>

export type Detail = Res<DictDetail>

// api路由公共前缀
export const apiPrefix = "/v1/admin/dictDetail"

/** 增 */
export function Create(data: FormCreate) {
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
