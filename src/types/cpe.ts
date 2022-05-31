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
Copyright (c) Steve Springett. All Rights Reserved.
*/

/**
 * Define the format for acceptable CPE URIs. Supports CPE 2.2 and CPE 2.3 formats.
 * Refer to {@link https://nvd.nist.gov/products/cpe} for official specification.
 * @see isCPE
 */
export type CPE = string

/* eslint-disable-next-line no-useless-escape -- value directly from XML or JSON spec, surrounded with ^$ */
const cpePattern = /^([c][pP][eE]:\/[AHOaho]?(:[A-Za-z0-9\._\-~%]*){0,6})$|^(cpe:2\.3:[aho\*\-](:(((\?*|\*?)([a-zA-Z0-9\-\._]|(\\[\\\*\?!&quot;#$$%&amp;'\(\)\+,\/:;&lt;=&gt;@\[\]\^`\{\|}~]))+(\?*|\*?))|[\*\-])){5}(:(([a-zA-Z]{2,3}(-([a-zA-Z]{2}|[0-9]{3}))?)|[\*\-]))(:(((\?*|\*?)([a-zA-Z0-9\-\._]|(\\[\\\*\?!&quot;#$$%&amp;'\(\)\+,\/:;&lt;=&gt;@\[\]\^`\{\|}~]))+(\?*|\*?))|[\*\-])){4})$/

export function isCPE (value: any): value is CPE {
  return typeof value === 'string' &&
        cpePattern.test(value)
}
