import { exec } from 'child_process'
import { writeFile } from 'fs'

import generateComponents from './generateComponents'
import generateIndex from './generateIndex'
import { Language, GeneratorOptions } from '../types'
import { ComponentDefinition } from './types'
import { getLanguage } from '../util'

const getFileExtension = (language: Language, isComponent: boolean = false) =>
  language.startsWith('ts') ? (isComponent ? 'tsx' : 'ts') : 'js'

const addIndexFile = async (appPath: string, language: Language, indexSource: string) => {
  const extension = getFileExtension(language)

  await new Promise(resolve => {
    writeFile(`${appPath}/src/components/index.${extension}`, indexSource, resolve)
  })
}

const addComponentFile = async (
  appPath: string,
  language: Language,
  component: ComponentDefinition
) => {
  const extension = getFileExtension(language, true)

  await new Promise(resolve => {
    writeFile(`${appPath}/src/components/${component.name}.${extension}`, component.source, resolve)
  })
}

const addComponentsFiles = async (
  appPath: string,
  language: Language,
  components: ComponentDefinition[]
) => {
  const promises = components.map(component => addComponentFile(appPath, language, component))
  await Promise.all(promises)
}

const resetComponentsDirectory = async (appPath: string) => {
  await new Promise(resolve => {
    exec(`rm -rf ${appPath}/src/components`, resolve)
  })
}

const ensureComponentsDirectory = async (appPath: string) => {
  await new Promise(resolve => {
    exec(`mkdir ${appPath}/src/components`, resolve)
  })
}

const generate = async (app: string, appPath: string, options: GeneratorOptions) => {
  const language = getLanguage(app)
  const components = generateComponents(language, options)
  const indexSource = generateIndex(language, components)

  await resetComponentsDirectory(appPath)
  await ensureComponentsDirectory(appPath)

  await Promise.all([
    addComponentsFiles(appPath, language, components),
    addIndexFile(appPath, language, indexSource)
  ])
}

export default generate
