export interface WebpackOptions {
  useCache?: boolean
  transpileOnly: boolean
}

export interface WebpackStats {
  buildTime: number
  size: number
}
