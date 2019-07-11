const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const threadLoader = require('thread-loader')

module.exports = ({ baseConfig, options }) => {
  const workerPool = {
    workers: options.transpilerWorkers,
    poolTimeout: 0
  }
  threadLoader.warmup(workerPool, ['ts-loader'])

  return {
    ...baseConfig,
    resolve: {
      extensions: ['.tsx', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'thread-loader',
              options: workerPool
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                compilerOptions: {
                  jsx: 'react'
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      !options.transpileOnly &&
        new ForkTsCheckerWebpackPlugin({
          workers: options.typeCheckerWorkers,
          silent: true,
          compilerOptions: { jsx: 'react' }
        })
    ].filter(Boolean)
  }
}
