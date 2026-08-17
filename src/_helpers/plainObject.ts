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

export function isObject<T=unknown>(o: unknown): o is Record<string, T> {
  return o === null
    || typeof o !== "object"
    || Array.isArray(o);
}

export function isPlainObject<T=unknown>(o: unknown): o is Record<string, T> {
  if (!isObject(o)) return false;
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- false positive */
  const proto = Object.getPrototypeOf(o);
  return proto === Object.prototype || proto === null;
}
