import { request } from "@/utils/service"
import type * as Table from "./types/table"

/** 增 */
export function createCarTableDataApi(data: Table.CreateTableRequestData) {
  return request({
    url: "car/repair",
    method: "post",
    data
  })
}

/** 改 */
export function updateCarTableDataApi(data: Table.UpdateTableRequestData) {
  return request({
    url: "car/repair/" + data.id,
    method: "put",
    data
  })
}

/** 查 */
export function getCarTableDataApi(params: Table.GetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "car/repair",
    method: "get",
    params
  })
}
