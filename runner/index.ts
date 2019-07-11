import path from 'path'

import Runner from './Runner'
import { TableReporter } from './reporters'
import { BenchmarkMatrix } from './types'
import { getBenchmark } from './util'

const main = async (matrixPath: string) => {
  const matrix: BenchmarkMatrix = require(path.resolve(matrixPath))
  const reporter = new TableReporter()
  const runner = new Runner(matrix, reporter)

  for (const benchmarkConfig of matrix.benchmarks) {
    const [benchmark, benchmarkOptions] = getBenchmark(benchmarkConfig)

    for (const generatorOptions of matrix.generatorOptions) {
      for (const app of matrix.apps) {
        runner.add(app, benchmark, benchmarkOptions, generatorOptions)
      }
    }
  }

  await runner.run()
}

main(process.argv[2])
