import { RunnerTask, RunnerStats, BenchmarkMatrix } from '../types'

export interface IReporter {
  runnerDidStart?(matrix: BenchmarkMatrix): void
  runnerDidFinished?(): void
  taskDidStart?(task: RunnerTask): void
  taskDidFinish?(task: RunnerTask, stats: RunnerStats): void
}
