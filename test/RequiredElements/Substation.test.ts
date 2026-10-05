import { describe, expect, it } from 'vitest';

import { substation_at_least_one_VoltageLevel_required } from '../../src/RequiredElements/Substation';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(substations: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${substations}
        </SCL>`;
}

describe('Substation', () => {
    describe('substation_at_least_one_VoltageLevel_required', () => {
        it('should return no issues when Substation has a VoltageLevel', () => {
            const doc = parseXMLString(sclXml(
                '<Substation name="S1"><VoltageLevel name="VL1"/></Substation>'
            ));
            expect(substation_at_least_one_VoltageLevel_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Substation has no VoltageLevel', () => {
            const doc = parseXMLString(sclXml('<Substation name="S1"/>'));
            const issues = substation_at_least_one_VoltageLevel_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Substation_at_least_one_VoltageLevel_required',
                filename: DOC_NAME,
                message: 'Substation shall contain at least one VoltageLevel',
            });
            expect(issues[0].element.getAttribute('name')).toBe('S1');
        });

        it('should return no issues when there is no Substation', () => {
            const doc = parseXMLString(sclXml(''));
            expect(substation_at_least_one_VoltageLevel_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
