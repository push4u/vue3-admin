export interface CreateTableRequestData {
  task_name?: string
  task_rule_name?: string
  task_desc?: string
  cron_enable?: boolean
  cron_spec?: string
  proxy_urls?: string
  opt_user_agent?: string
  opt_max_depth?: number
  opt_allowed_domains?: string
  opt_url_filters?: string
  opt_max_body_size?: number
  opt_request_timeout?: number
  output_type?: string
  output_exportdb_id?: number
  auto_migrate?: boolean
  limit_enable?: boolean
  limit_domain_glob?: string
  limit_delay?: number
  limit_random_delay?: number
  limit_parallelism?: number
}

export interface UpdateTableRequestData extends CreateTableRequestData {
  id: string
}

export interface GetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  page_size: number
  /** 查询参数：用户名 */
  _like_task_name?: string
  /** 查询参数：手机号 */
  status?: number
}

export interface GetTableData {
  auto_migrate: boolean
  counts: number
  created_at: string
  cron_enable: boolean
  cron_spec: string
  id: string
  limit_delay: number
  limit_domain_glob: string
  limit_domain_regexp: string
  limit_enable: boolean
  limit_parallelism: number
  limit_random_delay: number
  opt_allowed_domains: string
  opt_max_body_size: number
  opt_max_depth: number
  opt_request_timeout: number
  opt_url_filters: string
  opt_user_agent: string
  output_exportdb_id: number
  output_type: string
  proxy_urls: string
  status: number
  task_desc: string
  task_name: string
  task_rule_name: string
  updated_at: string
}

export type GetTableResponseData = ApiResponseData<{
  list: GetTableData[]
  count: number
}>

export interface GetTableExportDBRequestData {
  offset: number
  size: number
}
export interface GetTableExportDBData {
  db_name: string
  host: string
  id: number
  password: string
  port: number
  show_name: string
  user: string
  created_at: string
  updated_at: string
}
export type GetTableExportDBResponseData = ApiResponseData<{
  list: GetTableExportDBData[]
  count: number
}>

export type GetTableRuleResponseData = ApiResponseData<{
  data: string[]
  total: number
}>
