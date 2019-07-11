import path from 'path'
import { exec } from 'child_process'

import generate from './generate'
import { Benchmark, GeneratorOptions, RunnerTask, RunnerStats, BenchmarkMatrix } from './types'
import { IReporter } from './reporters/types'

const runTask = async (task: RunnerTask): Promise<RunnerStats> => {
  const commandPath = path.resolve(__dirname, '../benchmarks', task.benchmark)
  const commandArgs = JSON.stringify([task.app, task.appPath, task.benchmarkOptions])
  const command = `ts-node ${commandPath} '${commandArgs}'`

  const stats: RunnerStats = await new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) return reject(error)
      resolve(JSON.parse(stdout))
    })
  })

  return stats
}

export default class Runner {
  private tasks: RunnerTask[] = []

  constructor(private matrix: BenchmarkMatrix, private reporter: IReporter) {}

  public add(
    app: string,
    benchmark: Benchmark,
    benchmarkOptions: {},
    generatorOptions: GeneratorOptions
  ) {
    this.tasks = [
      ...this.tasks,
      {
        app,
        appPath: path.resolve(__dirname, '../apps/', app),
        benchmark,
        benchmarkOptions,
        generatorOptions
      }
    ]
  }

  public async run() {
    this.reporter.runnerDidStart && this.reporter.runnerDidStart(this.matrix)

    while (this.tasks.length > 0) {
      const task = this.tasks.shift()!

      this.reporter.taskDidStart && this.reporter.taskDidStart(task)
      await generate(task.app, task.appPath, task.generatorOptions)

      const stats = await runTask(task)
      this.reporter.taskDidFinish && this.reporter.taskDidFinish(task, stats)
    }

    this.reporter.runnerDidFinished && this.reporter.runnerDidFinished()
  }
}
