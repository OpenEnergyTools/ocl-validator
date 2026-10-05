import { describe, expect, it } from 'vitest';

import { lNodeType_at_least_one_DO_required } from '../../src/RequiredElements/LNodeType';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(lNodeTypes: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <DataTypeTemplates>
                ${lNodeTypes}
            </DataTypeTemplates>
        </SCL>`;
}

describe('LNodeType', () => {
    describe('lNodeType_at_least_one_DO_required', () => {
        it('should return no issues when LNodeType has a DO', () => {
            const doc = parseXMLString(sclXml(
                '<LNodeType id="T1" lnClass="LLN0"><DO name="Beh" type="DOType1"/></LNodeType>'
            ));
            expect(lNodeType_at_least_one_DO_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when LNodeType has no DO', () => {
            const doc = parseXMLString(sclXml('<LNodeType id="T1" lnClass="LLN0"/>'));
            const issues = lNodeType_at_least_one_DO_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LNodeType_at_least_one_DO_required',
                filename: DOC_NAME,
                message: 'LNodeType shall contain at least one DO',
            });
            expect(issues[0].element.getAttribute('id')).toBe('T1');
        });

        it('should return no issues when there is no LNodeType', () => {
            const doc = parseXMLString(sclXml(''));
            expect(lNodeType_at_least_one_DO_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
