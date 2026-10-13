import { describe, expect, it } from 'vitest';

import { abstractDataObject_RefersToDOType } from '../../src/SemanticConstraints/AbstractDataObject';

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

describe('AbstractDataObject', () => {
    describe('abstractDataObject_RefersToDOType', () => {
        it('should return no issues when DO and SDO refer to existing DOTypes', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="DOT1"/>
                </LNodeType>
                <DOType id="DOT1" cdc="SPS">
                    <SDO name="sub" type="DOT2"/>
                </DOType>
                <DOType id="DOT2" cdc="SPS"/>`));
            expect(abstractDataObject_RefersToDOType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there are no DO or SDO elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>`);
            expect(abstractDataObject_RefersToDOType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a DO referring to a missing DOType', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod" type="MISSING"/>
                </LNodeType>`));
            const issues = abstractDataObject_RefersToDOType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AbstractDataObject_RefersToDOType',
                filename: DOC_NAME,
                message: 'DO or SDO (name=Mod) does not refer an existing DOType in DataTypeTemplates section',
            });
            expect(issues[0].element.tagName).toBe('DO');
        });

        it('should report an SDO referring to a missing DOType', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <DOType id="DOT1" cdc="SPS">
                    <SDO name="sub" type="MISSING"/>
                </DOType>`));
            const issues = abstractDataObject_RefersToDOType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('SDO');
        });

        it('should skip a DO without a type attribute', () => {
            const doc = parseXMLString(sclWithTemplates(`
                <LNodeType id="T1" lnClass="MMXU">
                    <DO name="Mod"/>
                </LNodeType>`));
            expect(abstractDataObject_RefersToDOType(doc, DOC_NAME)).toEqual([]);
        });
    });
});
