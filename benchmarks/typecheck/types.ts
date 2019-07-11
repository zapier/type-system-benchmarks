export interface TypeCheckerStats {
  checkTime: number
}

export type TypeCheckerFunction = (cwd: string) => Promise<TypeCheckerStats>
