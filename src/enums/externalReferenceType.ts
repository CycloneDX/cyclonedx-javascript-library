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
  SourceDistribution = 'source-distribution',
  Distribution = 'distribution',
  DistributionIntake = 'distribution-intake',
  License = 'license',
  BuildMeta = 'build-meta',
  BuildSystem = 'build-system',
  ReleaseNotes = 'release-notes',
  SecurityContact = 'security-contact',
  ModelCard = 'model-card',
  Log = 'log',
  Configuration = 'configuration',
  Evidence = 'evidence',
  Formulation = 'formulation',
  Attestation = 'attestation',
  ThreatModel = 'threat-model',
  AdversaryModel = 'adversary-model',
  RiskAssessment = 'risk-assessment',
  VulnerabilityAssertion = 'vulnerability-assertion',
  ExploitabilityStatement = 'exploitability-statement',
  PentestReport = 'pentest-report',
  StaticAnalysisReport = 'static-analysis-report',
  DynamicAnalysisReport = 'dynamic-analysis-report',
  RuntimeAnalysisReport = 'runtime-analysis-report',
  ComponentAnalysisReport = 'component-analysis-report',
  MaturityReport = 'maturity-report',
  CertificationReport = 'certification-report',
  CodifiedInfrastructure = 'codified-infrastructure',
  QualityMetrics = 'quality-metrics',
  POAM = 'poam',
  ElectronicSignature = 'electronic-signature',
  DigitalSignature = 'digital-signature',
  RFC9116 = 'rfc-9116',

  // --

  Other = 'other',
}
