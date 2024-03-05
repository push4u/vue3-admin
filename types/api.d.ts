/** 所有 api 接口的响应数据都应该准守该格式 */
interface Res<T> {
  code: number
  data: T
  msg: string
}

interface IdTime {
  id: number
  created_at?: string
  updated_at?: string
}

interface Pagination {
  page: number
  page_size: number
}

interface Select {
  label: string
  value: number
}

type SelectRes = Res<Select[]>

type DeleteRes = Res<boolean>
