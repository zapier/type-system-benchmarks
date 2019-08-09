const threadLoader = require('thread-loader')

module.exports = ({ baseConfig, options }) => {
  const workerPool = {
    workers: options.transpilerWorkers,
    poolTimeout: 0
  }
  threadLoader.warmup(workerPool, [
    'babel-loader',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-flow'
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
            options.cacheDirectory && {
              loader: 'cache-loader',
              options: {
                cacheDirectory: options.cacheDirectory
              }
            },
            {
              loader: 'thread-loader',
              options: workerPool
            },
            'babel-loader'
          ].filter(Boolean)
        }
      ]
    }
  }
}
