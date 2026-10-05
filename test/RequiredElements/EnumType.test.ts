import { describe, expect, it } from 'vitest';

import { enumType_at_least_one_EnumVal_required } from '../../src/RequiredElements/EnumType';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(enumTypes: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <DataTypeTemplates>
                ${enumTypes}
            </DataTypeTemplates>
        </SCL>`;
}

describe('EnumType', () => {
    describe('enumType_at_least_one_EnumVal_required', () => {
        it('should return no issues when EnumType has an EnumVal', () => {
            const doc = parseXMLString(sclXml(
                '<EnumType id="E1"><EnumVal ord="1">on</EnumVal></EnumType>'
            ));
            expect(enumType_at_least_one_EnumVal_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when EnumType has no EnumVal', () => {
            const doc = parseXMLString(sclXml('<EnumType id="E1"/>'));
            const issues = enumType_at_least_one_EnumVal_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'EnumType_at_least_one_EnumVal_required',
                filename: DOC_NAME,
                message: 'EnumType shall contain at least one EnumVal',
            });
            expect(issues[0].element.getAttribute('id')).toBe('E1');
        });

        it('should return one issue per faulty EnumType', () => {
            const doc = parseXMLString(sclXml(
                '<EnumType id="E1"/><EnumType id="E2"><EnumVal ord="1">x</EnumVal></EnumType><EnumType id="E3"/>'
            ));
            const issues = enumType_at_least_one_EnumVal_required(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
        });

        it('should return no issues when there is no EnumType', () => {
            const doc = parseXMLString(sclXml(''));
            expect(enumType_at_least_one_EnumVal_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
