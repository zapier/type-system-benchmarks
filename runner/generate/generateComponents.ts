import { GeneratorOptions, Language } from '../types'
import { ComponentDefinition, PropType, PropDefinition, PropValue } from './types'

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

const generateValueFromType = (type: PropType): PropValue =>
  ({
    [PropType.string]: Math.random()
      .toString(36)
      .slice(2),
    [PropType.number]: Math.random() * 10e6,
    [PropType.boolean]: Math.random() > 0.5
  }[type])

const generateProp = (): PropDefinition => {
  const type = generateType()

  return {
    name: `prop$${generatePropId()}`,
    type,
    value: generateValueFromType(type)
  }
}

const generateProps = (propsCount: number): PropDefinition[] =>
  [...Array(propsCount)].map(generateProp)

const renderTypeDeclaration = (name: string, props: PropDefinition[]): string => `
  type ${name}Props = {
    ${props.map(prop => `${prop.name}?: ${prop.type}`).join(',\n')}
  }
`

const renderDefaultProps = (name: string, props: PropDefinition[]): string => `
  ${name}.defaultProps = {
    ${props
      .map(prop => `${prop.name}: ${prop.type === 'string' ? `'${prop.value}'` : prop.value}`)
      .join(',\n')}
  }
`

const renderComponentJSX = (
  { propsIndex } = {
    propsIndex: 'key'
  }
): string => `
  <div>
    {Object.keys(props).map(key => <span>{props[${propsIndex}]}</span>)}
  </div>
`

const generateJSComponent = (propsCount: number): ComponentDefinition => {
  const name = `Component$${generateComponentId()}`
  const props = generateProps(propsCount)

  const source = `
    import React from 'react'

    const ${name} = (props) => (
      ${renderComponentJSX()}
    )

    ${renderDefaultProps(name, props)}

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

    ${renderTypeDeclaration(name, props)}

    const ${name} = (props: ${name}Props) => (
      ${renderComponentJSX()}
    )

    ${renderDefaultProps(name, props)}

    export default ${name}
  `

  return { name, source }
}

const generateTSComponent = (propsCount: number): ComponentDefinition => {
  const name = `Component$${generateComponentId()}`
  const props = generateProps(propsCount)

  const source = `
    import React, { FC } from 'react'

    ${renderTypeDeclaration(name, props)}

    const ${name}: FC<${name}Props> = (props) => (
      ${renderComponentJSX({
        propsIndex: 'key as keyof ${name}Props'
      })}
    )

    ${renderDefaultProps(name, props)}

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
