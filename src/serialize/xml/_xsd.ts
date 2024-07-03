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
 * > *normalizedString* represents white space normalized strings.
 * > The [·value space·](https://www.w3.org/TR/xmlschema-2/#dt-value-space) of normalizedString is the set of strings that do not contain the carriage return (#xD), line feed (#xA) nor tab (#x9) characters.
 * > The [·lexical space·](https://www.w3.org/TR/xmlschema-2/#dt-lexical-space) of normalizedString is the set of strings that do not contain the carriage return (#xD), line feed (#xA) nor tab (#x9) characters.
 * > The [·base type·](https://www.w3.org/TR/xmlschema-2/#dt-basetype) of normalizedString is [string](https://www.w3.org/TR/xmlschema-2/#string).
 * @see {@link http://www.w3.org/TR/xmlschema-2/#normalizedString|normalizedStrin spec}
 *
 * @internal
 */
export function normalizedString(s: string): string {
  // (hexa)decimal may include leading zeros
  // hexadecimal must have a leading `x` in lowercase
  // hexadecimal may include uppercase and lowercase
  return s.replace(/[\t\n\r]|&#(?:x0*[9aAdD]|0*(?:9|10|14));/g, ' ')
}


/**
 * > *token* represents tokenized strings.
 * > The [·value space·](https://www.w3.org/TR/xmlschema-2/#dt-value-space) of token is the set of strings that do not contain the carriage return (#xD), line feed (#xA) nor tab (#x9) characters, that have no leading or trailing spaces (#x20) and that have no internal sequences of two or more spaces.
 * > The [·lexical space·](https://www.w3.org/TR/xmlschema-2/#dt-lexical-space) of token is the set of strings that do not contain the carriage return (#xD), line feed (#xA) nor tab (#x9) characters, that have no leading or trailing spaces (#x20) and that have no internal sequences of two or more spaces.
 * > The [·base type·](https://www.w3.org/TR/xmlschema-2/#dt-basetype) of token is [normalizedString](https://www.w3.org/TR/xmlschema-2/#normalizedString).
 * @see {@link http://www.w3.org/TR/xmlschema-2/#token|token spec}
 *
 * @internal
 */
export function token(s: string): string {
  // according to spec, `token` inherits from `normalizedString` - so we utilize it here.
  return normalizedString(s).trim().replace(/ +/g, ' ')
}
