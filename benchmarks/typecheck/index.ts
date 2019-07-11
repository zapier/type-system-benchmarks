import { exec } from 'child_process'

import { Language } from '../../runner/types'
import { getLanguage } from '../../runner/util'
import { TypeCheckerFunction, TypeCheckerStats } from './types'

const checkWithFlow: TypeCheckerFunction = async (cwd: string) => {
  const startTime = Date.now()

  await new Promise(resolve => {
    exec('flow', { cwd }, () => resolve())
  })

  const endTime = Date.now()

  await new Promise(resolve => {
    exec('flow stop', { cwd }, resolve)
  })

  return { checkTime: endTime - startTime }
}

const checkWithTypescript: TypeCheckerFunction = async (cwd: string) => {
  const startTime = Date.now()

  await new Promise(resolve => {
    exec('tsc --noEmit --project tsconfig.json', { cwd }, () => resolve())
  })

  const endTime = Date.now()

  return { checkTime: endTime - startTime }
}

const TypeCheckers: Record<Language, TypeCheckerFunction> = {
  [Language.js]: async () => await { checkTime: 0 },
  [Language.jsFlow]: checkWithFlow,
  [Language.ts]: checkWithTypescript
}

const main = async (app: string, appPath: string): Promise<TypeCheckerStats> => {
  const language = getLanguage(app)
  return await TypeCheckers[language](appPath)
}

!(async () => {
  const [app, appPath] = JSON.parse(process.argv[2])
  const stats = await main(app, appPath)
  console.log(JSON.stringify(stats))
})()
