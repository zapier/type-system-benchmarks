import Table from 'cli-table3'
import cliSpinners from 'cli-spinners'
import logUpdate from 'log-update'
import { IReporter } from './types'
import { BenchmarkMatrix, Benchmark, GeneratorOptions, RunnerTask, RunnerStats } from '../types'
import { getBenchmark } from '../util'

const ColumnWidth = 20

const serializeOptions = (options: {}) =>
  Object.entries(options)
    .map(([name, value]) => `${name.slice(0, 5)}: ${value}`)
    .join(', ')

const getRowKey = (
  benchmark: Benchmark,
  benchmarkOptions: {},
  generatorOptions: GeneratorOptions
) =>
  [
    `generator(${serializeOptions(generatorOptions)})`,
    `${benchmark}(${serializeOptions(benchmarkOptions)})`
  ].join('\n')

const createTable = (matrix: BenchmarkMatrix): string[][] =>
  // @ts-ignore
  new Table({
    head: ['', ...matrix.apps],
    colWidths: [null, ...Array(matrix.apps.length).fill(ColumnWidth)],
    rowHeights: [2, ...Array(matrix.apps.length).fill(2)],
    // @ts-ignore
    rowAligns: 'center'
  })

const initTable = (table: string[][], matrix: BenchmarkMatrix) => {
  for (const [benchmark, benchmarkOptions] of matrix.benchmarks.map(getBenchmark)) {
    for (const generatorOptions of matrix.generatorOptions) {
      table.push([
        getRowKey(benchmark, benchmarkOptions, generatorOptions),
        ...Array(matrix.apps.length).fill('')
      ])
    }
  }
}

const update = (
  table: string[][],
  apps: string[],
  { app, benchmark, benchmarkOptions, generatorOptions }: RunnerTask,
  stats: RunnerStats | string
) => {
  const colIndex = apps.indexOf(app) + 1
  const rowIndex = table.indexOf(
    table.find(row => row[0] === getRowKey(benchmark, benchmarkOptions, generatorOptions))!
  )

  table[rowIndex][colIndex] =
    typeof stats === 'string'
      ? stats
      : Object.entries(stats)
          .map(([name, value]) => `${name}: ${value}`)
          .join('\n')
}

const render = (table: string[][]) => {
  logUpdate(table.toString())
}

export default class TableReporter implements IReporter {
  private matrix: BenchmarkMatrix
  private table: string[][]
  private timeout: number

  public runnerDidStart(matrix: BenchmarkMatrix) {
    this.matrix = matrix
    this.table = createTable(matrix)

    initTable(this.table, matrix)
    render(this.table)
  }

  public taskDidStart(task: RunnerTask): void {
    this.renderProgress(task)
  }

  public taskDidFinish(task: RunnerTask, stats: RunnerStats): void {
    clearTimeout(this.timeout)
    update(this.table, this.matrix.apps, task, stats)
    render(this.table)
  }

  private renderProgress(task: RunnerTask, index: number = 0) {
    update(
      this.table,
      this.matrix.apps,
      task,
      ' '.repeat(ColumnWidth / 2 - 4) +
        cliSpinners.bouncingBar.frames[index % cliSpinners.bouncingBar.frames.length]
    )
    render(this.table)
    this.timeout = setTimeout(() => this.renderProgress(task, index + 1), 300) as any
  }
}
