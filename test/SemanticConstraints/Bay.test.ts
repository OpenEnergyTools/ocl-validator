import { describe, expect, it } from 'vitest';

import {
    Bay_unique_ConductingEquipment_name,
    Bay_unique_DirectChild_name
} from '../../src/SemanticConstraints/Bay';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('Bay', () => {
    describe('Bay_unique_ConductingEquipment_name', () => {
        it('should return no issues when ConductingEquipment names are unique', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConductingEquipment name="QB1" type="DIS"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_ConductingEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there is a single ConductingEquipment', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_ConductingEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a Bay with duplicate ConductingEquipment names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConductingEquipment name="QA1" type="DIS"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_ConductingEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Bay_unique_ConductingEquipment_name',
                filename: DOC_NAME,
                message: 'ConductingEquipment in Bay shall have different name',
            });
            expect(issues[0].element?.tagName).toBe('Bay');
        });

        it('should return no issues when ConductingEquipment names are unique with empty names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="" type="CBR"/>
                                <ConductingEquipment name="QB1" type="DIS"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_ConductingEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there are no ConductingEquipment elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_ConductingEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report multiple duplicate ConductingEquipment names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConductingEquipment name="QA1" type="DIS"/>
                                <ConductingEquipment name="QA1" type="SWI"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_ConductingEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Bay_unique_ConductingEquipment_name');
        });

        it('should handle multiple Bays with different ConductingEquipment names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConductingEquipment name="QB1" type="DIS"/>
                            </Bay>
                            <Bay name="Bay2">
                                <ConductingEquipment name="QA2" type="CBR"/>
                                <ConductingEquipment name="QB2" type="DIS"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_ConductingEquipment_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issues for each Bay with duplicate ConductingEquipment names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConductingEquipment name="QA1" type="DIS"/>
                            </Bay>
                            <Bay name="Bay2">
                                <ConductingEquipment name="QB1" type="CBR"/>
                                <ConductingEquipment name="QB1" type="DIS"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_ConductingEquipment_name(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'Bay_unique_ConductingEquipment_name')).toBe(true);
        });
    });

    describe('Bay_unique_DirectChild_name', () => {
        it('should return no issues when all direct child names are unique', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConnectivityNode name="CN1"/>
                                <PowerTransformer name="PT1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_DirectChild_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate names across different child types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="X1" type="CBR"/>
                                <ConnectivityNode name="X1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Bay_unique_DirectChild_name',
                filename: DOC_NAME,
                message: 'All direct childs in Bay shall have different name',
            });
            expect(issues[0].element?.tagName).toBe('Bay');
        });

        it('should report duplicate names within the same child type', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConnectivityNode name="CN1"/>
                                <ConnectivityNode name="CN1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Bay_unique_DirectChild_name');
        });

        it('should return no issues when child elements have empty names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="" type="CBR"/>
                                <ConnectivityNode name="CN1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_DirectChild_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when all children have empty names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="" type="CBR"/>
                                <ConnectivityNode name=""/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_DirectChild_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate names with Function and GeneralEquipment', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <Function name="F1"/>
                                <GeneralEquipment name="F1" type="GEN"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Bay_unique_DirectChild_name');
        });

        it('should handle multiple Bays with different child names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConnectivityNode name="CN1"/>
                            </Bay>
                            <Bay name="Bay2">
                                <ConductingEquipment name="QB1" type="CBR"/>
                                <ConnectivityNode name="CN2"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            expect(Bay_unique_DirectChild_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issues for each Bay with duplicate child names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="X1" type="CBR"/>
                                <ConnectivityNode name="X1"/>
                            </Bay>
                            <Bay name="Bay2">
                                <PowerTransformer name="Y1"/>
                                <GeneralEquipment name="Y1" type="GEN"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'Bay_unique_DirectChild_name')).toBe(true);
        });

        it('should handle Bay in Process section', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Process>
                        <Substation name="Sub1">
                            <VoltageLevel name="VL1">
                                <Bay name="Bay1">
                                    <ConductingEquipment name="QA1" type="CBR"/>
                                    <ConductingEquipment name="QA1" type="DIS"/>
                                </Bay>
                            </VoltageLevel>
                        </Substation>
                    </Process>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Bay_unique_DirectChild_name');
        });

        it('should not report duplicate names for different child types with same name in different Bays', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation name="Sub1">
                        <VoltageLevel name="VL1">
                            <Bay name="Bay1">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConnectivityNode name="QA1"/>
                            </Bay>
                            <Bay name="Bay2">
                                <ConductingEquipment name="QA1" type="CBR"/>
                                <ConnectivityNode name="QA1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`);
            const issues = Bay_unique_DirectChild_name(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'Bay_unique_DirectChild_name')).toBe(true);
        });
    });
});
