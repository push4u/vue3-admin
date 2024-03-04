import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createDatabaseTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "spider/exportdb",
    method: "post",
    data
  })
}

/** 删 */
export function deleteDatabaseTableDataApi(id: number) {
  return request({
    url: `spider/exportdb/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateDatabaseTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "spider/exportdb/" + data.id,
    method: "put",
    data
  })
}

/** 查 */
export function getDatabaseTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "spider/exportdb",
    method: "get",
    params
  })
}
