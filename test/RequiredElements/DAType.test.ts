import { describe, expect, it } from 'vitest';

import { dAType_at_least_one_BDA_required } from '../../src/RequiredElements/DAType';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(daTypes: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <DataTypeTemplates>
                ${daTypes}
            </DataTypeTemplates>
        </SCL>`;
}

describe('DAType', () => {
    describe('dAType_at_least_one_BDA_required', () => {
        it('should return no issues when DAType has a BDA', () => {
            const doc = parseXMLString(sclXml(
                '<DAType id="T1"><BDA name="bda1" bType="BOOLEAN"/></DAType>'
            ));
            expect(dAType_at_least_one_BDA_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when DAType has no BDA', () => {
            const doc = parseXMLString(sclXml('<DAType id="T1"/>'));
            const issues = dAType_at_least_one_BDA_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DAType_at_least_one_BDA_required',
                filename: DOC_NAME,
                message: 'DAType shall contain at least one BDA',
            });
            expect(issues[0].element.getAttribute('id')).toBe('T1');
        });

        it('should return one issue per faulty DAType', () => {
            const doc = parseXMLString(sclXml(
                '<DAType id="T1"/><DAType id="T2"><BDA name="b" bType="BOOLEAN"/></DAType><DAType id="T3"/>'
            ));
            const issues = dAType_at_least_one_BDA_required(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues[0].element.getAttribute('id')).toBe('T1');
            expect(issues[1].element.getAttribute('id')).toBe('T3');
        });

        it('should return no issues when there is no DAType', () => {
            const doc = parseXMLString(sclXml(''));
            expect(dAType_at_least_one_BDA_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
