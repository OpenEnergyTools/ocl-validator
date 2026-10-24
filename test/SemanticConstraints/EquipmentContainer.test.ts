import { describe, expect, it } from 'vitest';

import {
    EquipmentContainer_unique_PowerTransformer_name,
    EquipmentContainer_unique_GeneralEquipment_name
} from '../../src/SemanticConstraints/EquipmentContainer';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('EquipmentContainer', () => {
    describe('EquipmentContainer_unique_PowerTransformer_name', () => {
        it('should return no issues when PowerTransformers in Substation have unique names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <PowerTransformer name="PT2"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PowerTransformer in VoltageLevel has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <PowerTransformer name="PT1"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PowerTransformer in Bay has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <PowerTransformer name="PT1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PowerTransformer in Process section has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Process>
                        <Substation name="Sub1">
                            <PowerTransformer name="PT1"/>
                        </Substation>
                    </Process>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PowerTransformers in nested EquipmentContainers have unique names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <VoltageLevel name="VL1">
                            <PowerTransformer name="PT2"/>
                            <Bay name="Bay1">
                                <PowerTransformer name="PT3"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                    <Process>
                        <Substation name="Sub2">
                            <VoltageLevel name="VL2">
                                <PowerTransformer name="PT4"/>
                            </VoltageLevel>
                        </Substation>
                    </Process>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate PowerTransformer names in Substation', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <PowerTransformer name="PT1"/>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'EquipmentContainer_unique_PowerTransformer_name',
                filename: DOC_NAME,
                message: 'PowerTransformer in EquipmentContainer shall have different name',
            });
            expect(issues[0].element?.tagName).toBe('Substation');
        });

        it('should report duplicate PowerTransformer names in VoltageLevel', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <PowerTransformer name="PT1"/>
                            <PowerTransformer name="PT1"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_PowerTransformer_name');
            expect(issues[0].element?.tagName).toBe('VoltageLevel');
        });

        it('should report duplicate PowerTransformer names in Bay', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <PowerTransformer name="PT1"/>
                                <PowerTransformer name="PT1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_PowerTransformer_name');
            expect(issues[0].element?.tagName).toBe('Bay');
        });

        it('should report duplicate PowerTransformer names in Process Substation', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Process>
                        <Substation name="Sub1">
                            <PowerTransformer name="PT1"/>
                            <PowerTransformer name="PT1"/>
                        </Substation>
                    </Process>
                </SCL>`);
            const issues = EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_PowerTransformer_name');
        });

        it('should report multiple EquipmentContainers with duplicate PowerTransformer names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <PowerTransformer name="PT1"/>
                    </Substation>
                    <Substation name="Sub2">
                        <VoltageLevel name="VL1">
                            <PowerTransformer name="PT2"/>
                            <PowerTransformer name="PT2"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'EquipmentContainer_unique_PowerTransformer_name')).toBe(true);
        });

        it('should return no issues when there are no PowerTransformers', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PowerTransformer has empty name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name=""/>
                        <PowerTransformer name="PT1"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should allow same PowerTransformer name in different EquipmentContainers', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <VoltageLevel name="VL1">
                            <PowerTransformer name="PT1"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('EquipmentContainer_unique_GeneralEquipment_name', () => {
        it('should return no issues when GeneralEquipments in Substation have unique names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <GeneralEquipment name="GE2" type="GEN"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GeneralEquipment in VoltageLevel has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <GeneralEquipment name="GE1" type="GEN"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GeneralEquipment in Bay has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <GeneralEquipment name="GE1" type="GEN"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GeneralEquipment in Process section has unique name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Process>
                        <Substation name="Sub1">
                            <GeneralEquipment name="GE1" type="GEN"/>
                        </Substation>
                    </Process>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GeneralEquipments in nested EquipmentContainers have unique names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <VoltageLevel name="VL1">
                            <GeneralEquipment name="GE2" type="GEN"/>
                            <Bay name="Bay1">
                                <GeneralEquipment name="GE3" type="GEN"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                    <Process>
                        <Substation name="Sub2">
                            <VoltageLevel name="VL2">
                                <GeneralEquipment name="GE4" type="GEN"/>
                            </VoltageLevel>
                        </Substation>
                    </Process>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate GeneralEquipment names in Substation', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <GeneralEquipment name="GE1" type="GEN"/>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'EquipmentContainer_unique_GeneralEquipment_name',
                filename: DOC_NAME,
                message: 'GeneralEquipment in EquipmentContainer shall have different name',
            });
            expect(issues[0].element?.tagName).toBe('Substation');
        });

        it('should report duplicate GeneralEquipment names in VoltageLevel', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <GeneralEquipment name="GE1" type="GEN"/>
                            <GeneralEquipment name="GE1" type="GEN"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_GeneralEquipment_name');
            expect(issues[0].element?.tagName).toBe('VoltageLevel');
        });

        it('should report duplicate GeneralEquipment names in Bay', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <GeneralEquipment name="GE1" type="GEN"/>
                                <GeneralEquipment name="GE1" type="GEN"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_GeneralEquipment_name');
        });

        it('should report duplicate GeneralEquipment names in Process Substation', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Process>
                        <Substation name="Sub1">
                            <GeneralEquipment name="GE1" type="GEN"/>
                            <GeneralEquipment name="GE1" type="GEN"/>
                        </Substation>
                    </Process>
                </SCL>`);
            const issues = EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('EquipmentContainer_unique_GeneralEquipment_name');
        });

        it('should report multiple EquipmentContainers with duplicate GeneralEquipment names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <GeneralEquipment name="GE1" type="GEN"/>
                    </Substation>
                    <Substation name="Sub2">
                        <VoltageLevel name="VL1">
                            <GeneralEquipment name="GE2" type="GEN"/>
                            <GeneralEquipment name="GE2" type="GEN"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'EquipmentContainer_unique_GeneralEquipment_name')).toBe(true);
        });

        it('should return no issues when there are no GeneralEquipments', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when GeneralEquipment has empty name', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="" type="GEN"/>
                        <GeneralEquipment name="GE1" type="GEN"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should allow same GeneralEquipment name in different EquipmentContainers', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <VoltageLevel name="VL1">
                            <GeneralEquipment name="GE1" type="GEN"/>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should handle mixed PowerTransformer and GeneralEquipment in same EquipmentContainer', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <PowerTransformer name="PT1"/>
                        <GeneralEquipment name="GE1" type="GEN"/>
                        <PowerTransformer name="PT2"/>
                        <GeneralEquipment name="GE2" type="GEN"/>
                    </Substation>
                </SCL>`);
            expect(EquipmentContainer_unique_PowerTransformer_name(doc, DOC_NAME)).toEqual([]);
            expect(EquipmentContainer_unique_GeneralEquipment_name(doc, DOC_NAME)).toEqual([]);
        });
    });
});
