import { describe, expect, it } from 'vitest';

import {
    DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates,
    DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates,
} from '../../src/SemanticConstraints/DAType';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('DAType', () => {
    describe('DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates', () => {
        it('should return no issues when all BDA names are unique', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <BDA name="bda1" bType="INT32"/>
                            <BDA name="bda2" bType="FLOAT32"/>
                            <BDA name="bda3" bType="BOOL"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DAType has a single BDA', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <BDA name="single" bType="INT32"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DAType has no BDA elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType"/>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when multiple DATypes each have unique BDA names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="Type1">
                            <BDA name="a" bType="INT32"/>
                            <BDA name="b" bType="FLOAT32"/>
                        </DAType>
                        <DAType id="Type2">
                            <BDA name="a" bType="BOOL"/>
                            <BDA name="c" bType="INT8"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate BDA names within a single DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <BDA name="duplicate" bType="INT32"/>
                            <BDA name="unique" bType="FLOAT32"/>
                            <BDA name="duplicate" bType="BOOL"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates',
                filename: DOC_NAME,
                message: 'Unique BDA name in DAType from DataTypeTemplates',
            });
            expect(issues[0].element.tagName).toBe('DAType');
        });

        it('should report multiple DATypes with duplicate BDA names', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="Type1">
                            <BDA name="dup" bType="INT32"/>
                            <BDA name="dup" bType="FLOAT32"/>
                        </DAType>
                        <DAType id="Type2">
                            <BDA name="x" bType="BOOL"/>
                            <BDA name="x" bType="INT8"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'DAType')).toBe(true);
        });

        it('should return no issues when no DataTypeTemplates exists', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1"/>
                </SCL>`);
            expect(DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates', () => {
        it('should return no issues when all ProtNs types are unique', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <ProtNs type="type1"/>
                            <ProtNs type="type2"/>
                            <ProtNs type="type3"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ProtNs has a single entry', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <ProtNs type="singleType"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DAType has no ProtNs elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType"/>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ProtNs has empty type attributes', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <ProtNs type=""/>
                            <ProtNs type=""/>
                            <ProtNs type="validType"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when multiple DATypes each have unique ProtNs types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="Type1">
                            <ProtNs type="a"/>
                            <ProtNs type="b"/>
                        </DAType>
                        <DAType id="Type2">
                            <ProtNs type="a"/>
                            <ProtNs type="c"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate ProtNs types within a single DAType', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="MyDAType">
                            <ProtNs type="duplicateType"/>
                            <ProtNs type="uniqueType"/>
                            <ProtNs type="duplicateType"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates',
                filename: DOC_NAME,
                message: 'Unique ProtNs type in DAType from DataTypeTemplates',
            });
            expect(issues[0].element.tagName).toBe('DAType');
        });

        it('should report multiple DATypes with duplicate ProtNs types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                        <DAType id="Type1">
                            <ProtNs type="dup"/>
                            <ProtNs type="dup"/>
                        </DAType>
                        <DAType id="Type2">
                            <ProtNs type="x"/>
                            <ProtNs type="x"/>
                        </DAType>
                    </DataTypeTemplates>
                </SCL>`);
            const issues = DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'DAType')).toBe(true);
        });

        it('should return no issues when no DataTypeTemplates exists', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1"/>
                </SCL>`);
            expect(DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });
    });
});
