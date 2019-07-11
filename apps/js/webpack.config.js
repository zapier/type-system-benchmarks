const threadLoader = require('thread-loader')

module.exports = ({ baseConfig, options }) => {
  const workerPool = {
    workers: options.transpilerWorkers,
    poolTimeout: 0
  }
  threadLoader.warmup(workerPool, [
    'babel-loader',
    '@babel/preset-env',
    '@babel/preset-react'
  ])

  return {
    ...baseConfig,
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'thread-loader',
              options: workerPool
            },
            'babel-loader'
          ]
        }
      ]
    }
  }
}
