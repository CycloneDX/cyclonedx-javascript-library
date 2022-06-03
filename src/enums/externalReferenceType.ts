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

export enum ExternalReferenceType {
  VCS = 'vcs',
  IssueTracker = 'issue-tracker',
  Website = 'website',
  Advisories = 'advisories',
  BOM = 'bom',
  MailingList = 'mailing-list',
  Social = 'social',
  Chat = 'chat',
  Documentation = 'documentation',
  Support = 'support',
  Distribution = 'distribution',
  License = 'license',
  BuildMeta = 'build-meta',
  BuildSystem = 'build-system',
  ReleaseNotes = 'release-notes',
  Other = 'other',
}
