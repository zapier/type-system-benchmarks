import { Language, BenchmarkConfiguration, Benchmark } from './types'

export const getLanguage = (app: string): Language => app.split('-')[0] as Language

export const getFileExtension = (language: Language) => (language === 'ts' ? 'tsx' : 'js')

export const getBenchmark = (benchmarkConfig: BenchmarkConfiguration): [Benchmark, {}] =>
  Array.isArray(benchmarkConfig) ? benchmarkConfig : [benchmarkConfig, {}]
