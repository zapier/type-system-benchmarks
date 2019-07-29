import { GeneratorOptions, Language } from '../types'
import { ComponentDefinition, PropType } from './types'

const generateComponentId = (() => {
  let id = 1
  return () => id++
})()

const generatePropId = (() => {
  let id = 1
  return () => id++
})()

const generateType = (): PropType =>
  [PropType.string, PropType.number, PropType.boolean][(Math.random() * 3) | 0]

const generateValueFromType = (type: PropType): any =>
  ({
    [PropType.string]: Math.random()
      .toString(36)
      .slice(2),
    [PropType.number]: Math.random() * 10e6,
    [PropType.boolean]: Math.random() > 0.5
  }[type])

const generateProp = () => {
  const type = generateType()

  return {
    name: `prop$${generatePropId()}`,
    type,
    value: generateValueFromType(type)
  }
}

const generateProps = (propsCount: number) => [...Array(propsCount)].map(generateProp)

const generateJSComponent = (propsCount: number): ComponentDefinition => {
  const name = `Component$${generateComponentId()}`
  const props = generateProps(propsCount)

  const source = `
    import React from 'react'
    import map from 'lodash/map';

    const ${name} = (props) => (
      <div>
        {map(props, (_v, key) => <span>{props[key]}</span>)}
      </div>
    )

    ${name}.defaultProps = {
      ${props
        .map(prop => `${prop.name}: ${prop.type === 'string' ? `'${prop.value}'` : prop.value}`)
        .join(',\n' + ' '.repeat(6))}
    }

    export default ${name}
  `

  return { name, source }
}

const generateJSFlowComponent = (propsCount: number): ComponentDefinition => {
  const name = `Component$${generateComponentId()}`
  const props = generateProps(propsCount)

  const source = `
    // @flow
    import React from 'react'
    import map from 'lodash/map';

    type ${name}Props = {
      ${props.map(prop => `${prop.name}?: ${prop.type}`).join(',\n' + ' '.repeat(6))}
    }

    const ${name} = (props: ${name}Props) => (
      <div>
        {map(props, (_v, key) => <span>{props[key]}</span>)}
      </div>
    )

    ${name}.defaultProps = {
      ${props
        .map(prop => `${prop.name}: ${prop.type === 'string' ? `'${prop.value}'` : prop.value}`)
        .join(',\n' + ' '.repeat(6))}
    }

    export default ${name}
  `

  return { name, source }
}

const generateTSComponent = (propsCount: number): ComponentDefinition => {
  const name = `Component$${generateComponentId()}`
  const props = generateProps(propsCount)

  const source = `
    import React, { FC } from 'react'
    import map from 'lodash/map';

    interface ${name}Props {
      ${props.map(prop => `${prop.name}?: ${prop.type}`).join('\n' + ' '.repeat(6))}
    }

    const ${name}: FC<${name}Props> = (props) => (
      <div>
        {map(props, (_v, key) => <span>{props[key]}</span>)}
      </div>
    )

    ${name}.defaultProps = {
      ${props
        .map(prop => `${prop.name}: ${prop.type === 'string' ? `'${prop.value}'` : prop.value}`)
        .join(',\n' + ' '.repeat(6))}
    }

    export default ${name}
  `

  return { name, source }
}

const ComponentGenerators: Record<Language, (propsCount: number) => ComponentDefinition> = {
  [Language.js]: generateJSComponent,
  [Language.jsFlow]: generateJSFlowComponent,
  [Language.ts]: generateTSComponent
}

const generateComponents = (language: Language, options: GeneratorOptions): ComponentDefinition[] =>
  [...Array(Math.max(0, options.components))].map(() =>
    ComponentGenerators[language](options.props)
  )

export default generateComponents
