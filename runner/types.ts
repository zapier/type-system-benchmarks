export enum Benchmark {
  typecheck = 'typecheck',
  webpack = 'webpack'
}

export enum Language {
  js = 'js',
  jsFlow = 'js+flow',
  ts = 'ts'
}

export type BenchmarkConfiguration = Benchmark | [Benchmark, {}]

export interface GeneratorOptions {
  components: number
  props: number
}

export interface BenchmarkMatrix {
  apps: string[]
  benchmarks: BenchmarkConfiguration[]
  generatorOptions: GeneratorOptions[]
}

export interface RunnerTask {
  app: string
  appPath: string
  benchmark: Benchmark
  benchmarkOptions: {}
  generatorOptions: GeneratorOptions
}

export type RunnerStats = Record<string, number>
