import { request } from "@/utils/service"
import type * as LoginLog from "@/api/system/log-record/types/login"
import type * as OperationLog from "@/api/system/log-record/types/operation"
import type * as UserLog from "@/api/system/log-record/types/user"

// api路由公共前缀
export const apiLoginLogPrefix = "/v1/admin/loginLog"
export const apiOperationLogPrefix = "/v1/admin/operationLog"
export const apiOperationLogHumanPrefix = "/v1/admin/operationLogHuman"

/** 查 */
export function ListOperationLog(params: OperationLog.ListReq) {
  return request<OperationLog.ListRes>({
    url: apiOperationLogPrefix,
    method: "get",
    params
  })
}
/** 查 */
export function ListUserLog(params: UserLog.ListReq) {
  return request<UserLog.ListRes>({
    url: apiOperationLogHumanPrefix,
    method: "get",
    params
  })
}
/** 查 */
export function ListLoginLog(params: LoginLog.ListReq) {
  return request<LoginLog.ListRes>({
    url: apiLoginLogPrefix,
    method: "get",
    params
  })
}
