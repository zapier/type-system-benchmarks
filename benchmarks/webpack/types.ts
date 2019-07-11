export interface WebpackOptions {
  clearCache?: boolean
  transpileOnly: boolean
}

export interface WebpackStats {
  buildTime: number
  size: number
}
