import { Tool } from '../models'
import { ExternalReferenceRepositoryBuilder } from './ExternalReferenceRepository'

export class ToolBuilder {
  #extRefRepoBuilder: ExternalReferenceRepositoryBuilder
  constructor (extRefRepoBuilder: ExternalReferenceRepositoryBuilder) {
    this.#extRefRepoBuilder = extRefRepoBuilder
  }

  makeFromPackage (data: any): Tool | undefined {
    if (typeof data.name !== 'string') {
      return undefined
    }
    const [np1, np2] = data.name.split('/', 2)

    const tool = new Tool()
    tool.name = np2 ?? np1
    tool.vendor = np2 === undefined
      ? undefined
      : np1.replace(/^@/, '')
    if (typeof data.version === 'string') {
      tool.version = data.version
    }
    tool.externalReferences = this.#extRefRepoBuilder.makeFromPackage(data)

    return tool
  }
}
