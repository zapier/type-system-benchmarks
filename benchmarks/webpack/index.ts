import fs from 'fs'
import os from 'os'
import path from 'path'
import webpack = require('webpack')
import { exec } from 'child_process'

import { getFileExtension, getLanguage } from '../../runner/util'
import { WebpackOptions, WebpackStats } from './types'

const compile = (compiler: webpack.Compiler): Promise<WebpackStats> =>
  new Promise((resolve, reject) => {
    compiler.run((error: Error, stats: webpack.Stats) => {
      if (error) {
        return reject(error)
      }

      const buildTime = stats.endTime! - stats.startTime!
      const { size } = fs.statSync(stats.compilation.assets['main.js'].existsAt)

      resolve({ buildTime, size })
    })
  })

const main = async (
  app: string,
  appPath: string,
  { useCache = false, transpileOnly = true }: WebpackOptions
): Promise<WebpackStats> => {
  const cacheDirectory = `${appPath}/.cache`
  const extension = getFileExtension(getLanguage(app))
  const configFactory = require(`${appPath}/webpack.config.js`)
  const cpus = os.cpus().length - 1

  const config: webpack.Configuration = configFactory({
    baseConfig: {
      mode: 'development',
      target: 'web',
      devtool: false,
      entry: `${appPath}/src/index.${extension}`,
      stats: false,
      output: {
        filename: `[name].js`,
        path: path.resolve(appPath, 'dist')
      }
    },
    options: {
      transpileOnly,
      transpilerWorkers: Math.max(cpus - (transpileOnly ? 0 : 1), 1),
      typeCheckerWorkers: 1,
      cacheDirectory: useCache ? cacheDirectory : undefined
    }
  })

  const compiler = webpack(config)

  if (useCache) {
    // Remove any existing cache on disk
    await new Promise(resolve => {
      exec(`rm -rf ${cacheDirectory}`, resolve)
    })

    // First compilation pass to generate the cache
    await compile(compiler)
  }

  return await compile(compiler)
}

!(async () => {
  const [app, appPath, options] = JSON.parse(process.argv[2])
  const stats = await main(app, appPath, options)
  console.log(JSON.stringify(stats))

  // Forces `thread-loader` to terminate
  process.exit()
})()
