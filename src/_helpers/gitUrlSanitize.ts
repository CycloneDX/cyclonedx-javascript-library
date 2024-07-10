/*!
This file is part of CycloneDX JavaScript Library.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

SPDX-License-Identifier: Apache-2.0
Copyright (c) OWASP Foundation. All Rights Reserved.
*/

const _sshGitUrlRE = /^(?<user>[^@:]+@)(?<host>[^:]+):(?<path>.*)$/
interface _sshGitUrlRE_groups {
  user?: string
  host: string
  path: string
}

export function tryCanonicalizeGitUrl <T extends (string | undefined)> (value: T): T {
  if (value === undefined) {
    return value
  }

  // this is a polyfill for URL.canParse()
  try {
    /* eslint-disable-next-line no-new */
    new URL(value)
    return value
    // was a valid URL already
  } catch {
    /* pass */
  }

  const sshGs = _sshGitUrlRE.exec(value)?.groups as _sshGitUrlRE_groups | undefined
  if (sshGs !== undefined) {
    return `git+ssh://${sshGs.user ?? ''}${sshGs.host}/${sshGs.path}` as T
  }

  return value
}
