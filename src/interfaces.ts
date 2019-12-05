export interface FieldOption {
  text: string
  value: string
}
export interface Field {
  prop: string
  label?: string
  type: string
  options?: FieldOption[]
  [key: string]: any
}