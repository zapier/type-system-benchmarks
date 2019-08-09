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
    '@babel/preset-typescript'
  ])

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
    },
    plugins: [
      !options.transpileOnly &&
        new ForkTsCheckerWebpackPlugin({
          workers: options.typeCheckerWorkers,
          silent: true
        })
    ].filter(Boolean)
  }
}
