export enum SpecVersion {
    v1_4 = '1.4',
    v1_3 = '1.3',
    v1_2 = '1.2',
    v1_1 = '1.1',
    v1_0 = '1.0',
}

export interface Spec {
    readonly version: SpecVersion
}

export class Spec1_4 implements Spec {
    readonly version = SpecVersion.v1_4
}

// @TODO add the other versions
