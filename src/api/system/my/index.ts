import { request } from "@/utils/service"
import { UserOption, User } from "@/api/system/user"
import { File } from "@/api/system/file"

export interface MyForm {
  nickname: string
  email: string
  phone: string
  avatar: number
  avatar_file: File | null
  sex?: number
  option: UserOption
}

export interface MyPasswordForm {
  old_password: string
  new_password: string
}

export type Detail = Res<User>

export const apiPrefix = "/v1/admin/my"

export function UpdateMy(data: MyForm) {
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
