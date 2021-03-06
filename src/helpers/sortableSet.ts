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

export interface Comparable {
  // The purpose of this method is not to test for equality, but have deterministic comparability.
  compare: (other: any) => number
}

export abstract class SortableSet<T extends Comparable> extends Set<T> {
  sorted (): T[] {
    return Array.from(this).sort((a: T, b: T) => a.compare(b))
  }
}
