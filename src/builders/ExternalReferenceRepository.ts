import { ExternalReference, ExternalReferenceRepository } from '../models'
import { ExternalReferenceType } from '../enums'
import { isNotUndefined } from '../helpers/types'

export class ExternalReferenceRepositoryBuilder {
  makeFromPackage (data: any): ExternalReferenceRepository {
    const refs: Array<ExternalReference | undefined> = []

    try { refs.push(this.#getVcs(data)) } catch (err) { /* pass */ }
    try { refs.push(this.#getHomepage(data)) } catch (err) { /* pass */ }
    try { refs.push(this.#getIssueTracker(data)) } catch (err) { /* pass */ }

    return new ExternalReferenceRepository(refs.filter(isNotUndefined))
  }

  #getVcs (data: any): ExternalReference | undefined {
    let url: string | undefined
    let comment: string | undefined

    const repository = data.repository
    if (typeof repository === 'string') {
      url = repository
      comment = 'as detected from package property "repository"'
    } else if (typeof repository === 'object') {
      if (typeof repository.url === 'string') {
        url = repository.url
        comment = 'as detected from package property "repository.url"'
      } else if (typeof repository.directory === 'string') {
        url = repository.directory
        comment = 'as detected from package property "repository.directory"'
      }
    }

    return url === undefined
      ? undefined
      : new ExternalReference(url, ExternalReferenceType.VCS, { comment })
  }

  #getHomepage (data: any): ExternalReference | undefined {
    const homepage = data.homepage
    return typeof homepage === 'string'
      ? new ExternalReference(homepage, ExternalReferenceType.Website, { comment: 'as detected from package property "homepage' })
      : undefined
  }

  #getIssueTracker (data: any): ExternalReference | undefined {
    const bugs = data.bugs
    let url: string | undefined
    let comment: string | undefined
    if (typeof bugs === 'string') {
      url = bugs
      comment = 'as detected from package property "bugs"'
    } else if (typeof bugs === 'object' && typeof bugs.url === 'string') {
      url = bugs.url
      comment = 'as detected from package property "bugs.url"'
    }
    return url === undefined
      ? undefined
      : new ExternalReference(url, ExternalReferenceType.IssueTracker, { comment })
  }
}
