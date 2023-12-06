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

const encoderMap = new Map<string, string>([
  [' ', '%20'],
  ['[', '%5B'],
  [']', '%5D'],
  ['<', '%3C'],
  ['>', '%3E'],
  ['{', '%7B'],
  ['}', '%7D']
])

const regEx = new RegExp(Object.keys(encoderMap).join('|'), 'gi')

function matcher (valueToMatch: string): string {
  const ret = encoderMap.get(valueToMatch)

  if (typeof ret === 'undefined') {
    return valueToMatch
  } else {
    return ret
  }
}

export function percentEncodeUrl (url: string): string {
  return url.replace(regEx, function (matched: string): string { return matcher(matched) })
}
