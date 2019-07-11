import { RunnerTask, RunnerStats, Benchmark } from '../types'
import { IReporter } from './types'

type ReporterEntry = Pick<RunnerTask, 'benchmarkOptions' | 'generatorOptions'> & {
  stats: RunnerStats
}

export default class JsonReporter implements IReporter {
  private allStats = new Map<Benchmark, ReporterEntry[]>()

  public taskDidFinish(task: RunnerTask, stats: RunnerStats): void {
    if (!this.allStats.has(task.benchmark)) {
      this.allStats.set(task.benchmark, [])
    }

    this.allStats.get(task.benchmark)!.push({
      benchmarkOptions: task.benchmarkOptions,
      generatorOptions: task.generatorOptions,
      stats
    })
  }

  public runnerDidFinished(): void {
    console.log(JSON.stringify([...this.allStats], null, 2))
  }
}
