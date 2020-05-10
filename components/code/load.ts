import { reqScript } from '@quercia/quercia'

import { aliases, dependencies } from './maps'

const loaded: Set<string> = new Set()

export const lang = (l: string): string => aliases[l] || l

const load = async (l: string) => {
  const language = lang(l)
  if (language == undefined || loaded.has(language)) {
    return
  }

  let deps: string | string[] = dependencies[language]
  if (!Array.isArray(deps)) {
    deps = [deps]
  }

  await Promise.all(deps.map(load))

  await reqScript(
    `https://unpkg.com/prismjs@1.20.0/components/prism-${language}.min.js`
  )
  loaded.add(language)
}

export default load
