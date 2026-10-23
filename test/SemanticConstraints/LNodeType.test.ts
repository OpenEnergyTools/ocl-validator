import { describe, expect, it } from 'vitest';

import { lNodeType_unique_DO_name_from_DataTypeTemplates } from '../../src/SemanticConstraints/LNodeType';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithTemplates(templates: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <DataTypeTemplates>
                ${templates}
            </DataTypeTemplates>
        </SCL>`;
}

describe('LNodeType', () => {
    describe('lNodeType_unique_DO_name_from_DataTypeTemplates', () => {
        it('should return no issues when all DO names are unique within LNodeType', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                    <DO name="Beh" type="DOT2"/>
                    <DO name="Health" type="DOT3"/>
                </LNodeType>`));
            expect(lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LNodeType has no DO elements', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                </LNodeType>`));
            expect(lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when DataTypeTemplates has no LNodeType elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <DataTypeTemplates>
                    </DataTypeTemplates>
                </SCL>`);
            expect(lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DO names within a single LNodeType', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                    <DO name="Beh" type="DOT2"/>
                    <DO name="Mod" type="DOT3"/>
                </LNodeType>`));
            const issues = lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNodeType_unique_DO_name_from_DataTypeTemplates',
                filename: DOC_NAME,
                message: 'Unique DO name in LNodeTYpe from DataTypeTemplates',
            });
            expect(issues[0].element?.getAttribute('id')).toBe('T1');
        });

        it('should report multiple LNodeTypes with duplicate DO names', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                    <DO name="Mod" type="DOT2"/>
                </LNodeType>
                <LNodeType id="T2" lnClass="LLN0">
                    <DO name="Beh" type="DOT1"/>
                    <DO name="Beh" type="DOT2"/>
                </LNodeType>`));
            const issues = lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues[0].element?.getAttribute('id')).toBe('T1');
            expect(issues[1].element?.getAttribute('id')).toBe('T2');
        });

        it('should not report duplicates across different LNodeTypes', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                </LNodeType>
                <LNodeType id="T2" lnClass="LLN0">
                    <DO name="Mod" type="DOT2"/>
                </LNodeType>`));
            expect(lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });

        it('should ignore SDO elements when checking DO uniqueness', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                    <SDO name="Mod" type="DOT2"/>
                </LNodeType>`));
            expect(lNodeType_unique_DO_name_from_DataTypeTemplates(doc, DOC_NAME)).toEqual([]);
        });
    });
});
