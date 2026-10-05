import { describe, expect, it } from 'vitest';

import { voltageLevel_at_least_one_Bay_required } from '../../src/RequiredElements/VoltageLevel';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(voltageLevels: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Substation name="S1">
                ${voltageLevels}
            </Substation>
        </SCL>`;
}

describe('VoltageLevel', () => {
    describe('voltageLevel_at_least_one_Bay_required', () => {
        it('should return no issues when VoltageLevel has a Bay', () => {
            const doc = parseXMLString(sclXml(
                '<VoltageLevel name="VL1"><Bay name="B1"/></VoltageLevel>'
            ));
            expect(voltageLevel_at_least_one_Bay_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when VoltageLevel has no Bay', () => {
            const doc = parseXMLString(sclXml('<VoltageLevel name="VL1"/>'));
            const issues = voltageLevel_at_least_one_Bay_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'VoltageLevel_at_least_one_Bay_required',
                filename: DOC_NAME,
                message: 'VoltageLevel shall contain at least one Bay',
            });
            expect(issues[0].element.getAttribute('name')).toBe('VL1');
        });

        it('should return one issue per faulty VoltageLevel', () => {
            const doc = parseXMLString(sclXml(
                '<VoltageLevel name="VL1"/><VoltageLevel name="VL2"><Bay name="B1"/></VoltageLevel>'
            ));
            const issues = voltageLevel_at_least_one_Bay_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('name')).toBe('VL1');
        });
    });
});
