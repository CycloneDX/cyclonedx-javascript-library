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

/**
 * Generate valid random SerialNumbers for {@link Models.Bom.serialNumber | Models.Bom.serialNumber}.
 */
export function randomSerialNumber (): string {
  const b = [
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    // UUID version 4
    Math.round(Math.random() * 0x0FFF) | 0x4000,
    // UUID version 4 variant 1
    Math.round(Math.random() * 0x3FFF) | 0x8000,
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF),
    Math.round(Math.random() * 0xFFFF)
  ].map(n => n.toString(16).padStart(4, '0'))
  return `urn:uuid:${b[0]}${b[1]}-${b[2]}-${b[3]}-${b[4]}-${b[5]}${b[6]}${b[7]}`
}
