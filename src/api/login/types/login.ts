import { GetTableData as LoginRolesData } from "../../system/role/types/table"
export interface LoginRequestData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  captcha: string
  /** 验证码id */
  captcha_id: string
}
export interface LoginData {
  /** token */
  token: string
  /** userinfo */
  user: LoginUserData
}
export interface LoginUserData {
  CreatedAt: string
  UpdatedAt: string
  avatar: number
  avatarFile: {
    id: number
    name: string
    url: string
    urls: null
    tag: string
    path: string
    key: string
    hash: string
    module: string
    createdBy: number
    createdAt: string
    updatedAt: string
  }
  createdBy: number
  email: string
  groups: []
  id: number
  nickName: string
  option: { defaultRouter: string }
  parentId: string
  path: string
  phone: string
  remark: string
  roles: LoginRolesData[]
  sex: number
  status: string
  username: string
}

export type LoginCodeResponseData = ApiResponseData<{ pic_path: string; captcha_id: string }>

export type LoginResponseData = ApiResponseData<LoginData>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
