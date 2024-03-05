import { request } from "@/utils/service"
import { FormMy, User } from "@/api/system/user"

export interface MyPasswordForm {
  old_password: string
  new_password: string
}

export type Detail = Res<User>

export const apiPrefix = "/v1/admin/my"

export function UpdateMy(data: FormMy) {
  return request<Detail>({
    url: apiPrefix,
    method: "put",
    data
  })
}

export function GetMy() {
  return request<Detail>({
    url: apiPrefix,
    method: "get"
  })
}

export function UpdateMyPassword(data: MyPasswordForm) {
  return request({
    url: apiPrefix + "/password",
    method: "put",
    data
  })
}
