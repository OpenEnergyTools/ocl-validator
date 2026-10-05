import { describe, expect, it } from 'vitest';

import { ied_at_least_one_AccessPoint_required } from '../../src/RequiredElements/IED';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(ieds: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${ieds}
        </SCL>`;
}

describe('IED', () => {
    describe('ied_at_least_one_AccessPoint_required', () => {
        it('should return no issues when IED has an AccessPoint', () => {
            const doc = parseXMLString(sclXml(
                '<IED name="IED1"><AccessPoint name="AP1"/></IED>'
            ));
            expect(ied_at_least_one_AccessPoint_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when IED has no AccessPoint', () => {
            const doc = parseXMLString(sclXml('<IED name="IED1"/>'));
            const issues = ied_at_least_one_AccessPoint_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'IED_at_least_one_AccessPoint_required',
                filename: DOC_NAME,
                message: 'IED shall contain at least one AccessPoint',
            });
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
        });

        it('should return one issue per faulty IED', () => {
            const doc = parseXMLString(sclXml(
                '<IED name="IED1"/><IED name="IED2"><AccessPoint name="AP1"/></IED><IED name="IED3"/>'
            ));
            const issues = ied_at_least_one_AccessPoint_required(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues[0].element.getAttribute('name')).toBe('IED1');
            expect(issues[1].element.getAttribute('name')).toBe('IED3');
        });

        it('should return no issues when there is no IED', () => {
            const doc = parseXMLString(sclXml(''));
            expect(ied_at_least_one_AccessPoint_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
