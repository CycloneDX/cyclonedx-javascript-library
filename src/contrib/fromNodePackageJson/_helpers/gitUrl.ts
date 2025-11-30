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

const _sshConnStringRE = /^(?<user>[^@:]+)@(?<host>[^:]+):(?<path>.*)$/
interface _sshConnStringRE_groups {
  user: string
  host: string
  path: string
}

/**
 * try to convert git connection string to actual valid URL
 */
export function tryCanonicalizeGitUrl (value: string | undefined): URL | string | undefined {
  if (value === undefined || value.length <= 0) {
    return undefined
  }

  try {
    return new URL(value)
  } catch {
    /* pass */
  }

  /* @ts-expect-error TS2322 */
  const sshGs: _sshConnStringRE_groups | undefined = _sshConnStringRE.exec(value)?.groups
  if (sshGs !== undefined) {
    try {
      // utilize URL so needed chars are properly url-encoded
      const u = new URL(`git+ssh://${sshGs.host}`)
      u.username = sshGs.user
      u.pathname = sshGs.path
      return u
    } catch {
      /* pass */
    }
  }

  return value
}
