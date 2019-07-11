import { Language } from '../types'
import { ComponentDefinition } from './types'

const generateIndex = (language: Language, components: ComponentDefinition[]) =>
  (language === Language.jsFlow ? '// @flow\n' : '') +
  components
    .map(component => `export { default as ${component.name} } from './${component.name}'`)
    .join('\n')

export default generateIndex
