export enum PropType {
  string = 'string',
  number = 'number',
  boolean = 'boolean'
}

export type PropDefinition = {
  name: string
  type: PropType
  value: string
}

export type PropValue = any

export interface ComponentDefinition {
  name: string
  source: string
}
