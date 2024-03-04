import { request } from "@/utils/service"

export interface Form {
  parent_id: number
  path: string
  name: string
  hidden: boolean
  component: string
  sort: number
  meta: meta
  parameters: parameter[]
}

export interface ListReq extends Pagination {
  name?: string
  parent_id?: number
  hidden?: boolean
}

export interface Menu extends IdTime {
  parent_id: number
  path: string
  name: string
  hidden: boolean
  component: string
  sort: number
  meta: meta
  children: Menu[]
  parameters: parameter[]
}

type meta = {
  keep_alive: boolean // 是否缓存
  default_menu: boolean // 是否是基础路由（开发中）
  title: string // 菜单名
  icon: string // 菜单图标
  close_tab: boolean // 自动关闭tab
  layout: string // 布局
  new_window_open: boolean // 新窗口打开
  api_id: number // 接口ID
}

type parameter = {
  id: string
  menu_id: number
  type: string
  key: string
  value: string
}

export type ListRes = Res<{
  list: Menu[]
  total: number
}>

export type Detail = Res<Menu>

// api路由公共前缀
export const apiPrefix = "/v1/admin/menu"

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
