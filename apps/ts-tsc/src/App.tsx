import React, { FC } from 'react'

import * as Components from './components'

const App: FC = () => {
  return (
    <div className="App">
      {Object.keys(Components).map(key => {
        const Component = (Components as any)[key]
        return <Component />
      })}
    </div>
  )
}

export default App
