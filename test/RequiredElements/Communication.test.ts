import { describe, expect, it } from 'vitest';

import { communication_at_least_one_SubNetwork_required } from '../../src/RequiredElements/Communication';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(communication: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${communication}
        </SCL>`;
}

describe('Communication', () => {
    describe('communication_at_least_one_SubNetwork_required', () => {
        it('should return no issues when Communication has a SubNetwork', () => {
            const doc = parseXMLString(sclXml(
                '<Communication><SubNetwork name="SN1"/></Communication>'
            ));
            expect(communication_at_least_one_SubNetwork_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Communication has no SubNetwork', () => {
            const doc = parseXMLString(sclXml('<Communication/>'));
            const issues = communication_at_least_one_SubNetwork_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Communication_at_least_one_SubNetwork_required',
                filename: DOC_NAME,
                message: 'Communication shall contain at least one SubNetwork',
            });
            expect(issues[0].element.tagName).toBe('Communication');
        });

        it('should return no issues when there is no Communication element', () => {
            const doc = parseXMLString(sclXml(''));
            expect(communication_at_least_one_SubNetwork_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
