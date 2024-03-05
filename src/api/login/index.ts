import { request } from "@/utils/service"

export interface Form {
  username?: string
  password?: string
  captcha?: string
  captcha_id?: string
}

export interface Token {
  /** token */
  token: string
}

export type CaptchaRes = Res<{ pic_path: string; captcha_id: string }>

export type LoginRes = Res<Token>

/** 获取登录验证码 */
export function GetCaptcha() {
  return request<CaptchaRes>({
    url: "/v1/admin/captcha",
    method: "get"
  })
}

/** 登录并返回 Token */
export function Login(data: Form) {
  return request<LoginRes>({
    url: "/v1/admin/login",
    method: "post",
    data
  })
}
