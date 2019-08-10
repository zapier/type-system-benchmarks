import path from 'path'
import parser, { Arguments } from 'yargs-parser'

import Runner from './Runner'
import { JsonReporter, TableReporter } from './reporters'
import { BenchmarkMatrix } from './types'
import { getBenchmark } from './util'

const parseArguments = (args: Arguments) => ({
  matrixPath: args._[0] || 'matrix.json',
  reporter: args.reporter === 'json' ? JsonReporter : TableReporter
})

const main = async (args: Arguments) => {
  const options = parseArguments(args)
  const matrix: BenchmarkMatrix = require(path.resolve(options.matrixPath))
  const reporter = new options.reporter()
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

main(parser(process.argv.slice(2)))
