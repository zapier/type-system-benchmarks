// @flow
import React from 'react'

import * as Components from './components'

const App = () => {
  return (
    <div className="App">
      {Object.keys(Components).map(key => {
        const Component = Components[key]
        return <Component />
      })}
    </div>
  )
}

export default App
