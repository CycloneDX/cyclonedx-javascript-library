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

import { OptPlugError } from './errors'

export type WillThrow = (() => never) & { fails: true }

function makeWIllThrow (message: string): WillThrow {
  const f: WillThrow = function (): never {
    throw new OptPlugError(message)
  }
  f.fails = true
  return Object.freeze(f)
}

type PossibleFunctionalities<Functionality> = Array<[string, () => Functionality]>

/** @internal */
export default function <Functionality> (
  name: string,
  pf: PossibleFunctionalities<Functionality>
): Functionality | WillThrow {
  for (const [, getF] of pf) {
    try {
      return getF()
    } catch {
      /* pass */
    }
  }
  return makeWIllThrow(
    `No ${name} available.\n` +
    'Please install one of the optional dependencies: ' +
    pf.map(kv => kv[0]).join(' || ')
  )
}
