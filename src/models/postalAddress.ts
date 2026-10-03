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

import type { Comparable } from '../_helpers/sortable'

export interface OptionalPostalAddressProperties {
  country?: PostalAddress['country']
  region?: PostalAddress['region']
  locality?: PostalAddress['locality']
  postOfficeBoxNumber?: PostalAddress['postOfficeBoxNumber']
  postalCode?: PostalAddress['postalCode']
  streetAddress?: PostalAddress['streetAddress']
}

/**
 * A postal address used to identify a contactable location.
 *
 * @see https://cyclonedx.org/docs/1.7/xml/#type_postalAddressType
 */
export class PostalAddress implements Comparable<PostalAddress> {
  country?: string
  region?: string
  locality?: string
  postOfficeBoxNumber?: string
  postalCode?: string
  streetAddress?: string

  constructor (op: OptionalPostalAddressProperties = {}) {
    this.country = op.country
    this.region = op.region
    this.locality = op.locality
    this.postOfficeBoxNumber = op.postOfficeBoxNumber
    this.postalCode = op.postalCode
    this.streetAddress = op.streetAddress
  }

  compare (other: PostalAddress): number {
    const comparables: Array<[string | undefined, string | undefined]> = [
      [this.country, other.country],
      [this.region, other.region],
      [this.locality, other.locality],
      [this.postOfficeBoxNumber, other.postOfficeBoxNumber],
      [this.postalCode, other.postalCode],
      [this.streetAddress, other.streetAddress]
    ]
    for (const [selfValue, otherValue] of comparables) {
      const compared = (selfValue ?? '').localeCompare(otherValue ?? '')
      if (compared !== 0) {
        return compared
      }
    }
    return 0
  }
}
