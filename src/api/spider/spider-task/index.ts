import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createSpiderTaskTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "spider/task",
    method: "post",
    data
  })
}

/** 删 */
export function deleteSpiderTaskTableDataApi(id: string) {
  return request({
    url: `spider/task/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateSpiderTaskTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "spider/task/" + data.id,
    method: "put",
    data
  })
}

/** 查 */
export function getSpiderTaskTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "spider/task",
    method: "get",
    params
  })
}
// listExportDB 导出数据库列表
export function listExportDBApi(params: Table.GetTableExportDBRequestData) {
  return request<Table.GetTableExportDBResponseData>({
    url: "spider/exportdb",
    method: "get",
    params
  })
}
// listRule rule列表
export function listRuleApi() {
  return request<Table.GetTableRuleResponseData>({
    url: "spider/rule",
    method: "get"
  })
}
// startTask 开始Task
export function startTask(data) {
  return request({
    url: "spider/task/" + data.id + "/start",
    method: "put",
    data
  })
}

// stopTask 停止Task
export function stopTask(data) {
  return request({
    url: "spider/task/" + data.id + "/stop",
    method: "put",
    data
  })
}
