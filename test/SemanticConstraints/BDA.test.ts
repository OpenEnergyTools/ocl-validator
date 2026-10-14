import { describe, expect, it } from 'vitest';

import {
    BDA_BDAType_allowedWhen_Enum,
    BDA_RefersToDATypeorEnumType
} from '../../src/SemanticConstraints/BDA';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithBDA(bda: string, templates = ''): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <DataTypeTemplates>
                ${templates}
                <DAType id="BDA_TEST_TYPE">${bda}</DAType>
            </DataTypeTemplates>
        </SCL>`;
}

describe('BDA', () => {
    describe('BDA_BDAType_allowedWhen_Enum', () => {
        it('should return no issues when type is absent for a primitive bType', () => {
            const doc = parseXMLString(sclWithBDA('<BDA name="value" bType="INT32"/>'));
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it.each(['Struct', 'Enum'])('should allow type when bType is %s', bType => {
            const doc = parseXMLString(sclWithBDA(`<BDA name="value" bType="${bType}" type="T1"/>`));
            expect(BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME)).toEqual([]);
        });

        it('should report type when bType is neither Struct nor Enum', () => {
            const doc = parseXMLString(sclWithBDA('<BDA name="value" bType="INT32" type="T1"/>'));
            const issues = BDA_BDAType_allowedWhen_Enum(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'BDA_BDAType_allowedWhen_Enum',
                filename: DOC_NAME,
                message: 'BDA.type is allowed only if bType = Struct or Enum',
            });
            expect(issues[0].element.tagName).toBe('BDA');
        });
    });

    describe('BDA_RefersToDATypeorEnumType', () => {
        it('should return no issues when Struct and Enum types exist', () => {
            const doc = parseXMLString(sclWithBDA(
                '<BDA name="structValue" bType="Struct" type="DT1"/><BDA name="enumValue" bType="Enum" type="ET1"/>',
                '<DAType id="DT1"/><EnumType id="ET1"/>'
            ));
            expect(BDA_RefersToDATypeorEnumType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report references to missing DAType and EnumType elements', () => {
            const doc = parseXMLString(sclWithBDA(
                '<BDA name="structValue" bType="Struct" type="MISSING_DT"/><BDA name="enumValue" bType="Enum" type="MISSING_ET"/>'
            ));
            const issues = BDA_RefersToDATypeorEnumType(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.map(issue => issue.message)).toEqual([
                'BDA (name=structValue) does not refer an existing DAType or EnumType in DataTypeTemplates section',
                'BDA (name=enumValue) does not refer an existing DAType or EnumType in DataTypeTemplates section',
            ]);
            expect(issues.map(issue => issue.element.tagName)).toEqual(['BDA', 'BDA']);
            expect(issues.every(issue => issue.severity === 'ERROR'
                && issue.id === 'BDA_RefersToDATypeorEnumType'
                && issue.filename === DOC_NAME)).toBe(true);
        });
    });
});