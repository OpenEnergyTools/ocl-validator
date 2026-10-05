import { describe, expect, it } from 'vitest';

import { subNetwork_at_least_one_ConnectedAP_required } from '../../src/RequiredElements/SubNetwork';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(subNetworks: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Communication>
                ${subNetworks}
            </Communication>
        </SCL>`;
}

describe('SubNetwork', () => {
    describe('subNetwork_at_least_one_ConnectedAP_required', () => {
        it('should return no issues when SubNetwork has a ConnectedAP', () => {
            const doc = parseXMLString(sclXml(
                '<SubNetwork name="SN1"><ConnectedAP iedName="IED1" apName="AP1"/></SubNetwork>'
            ));
            expect(subNetwork_at_least_one_ConnectedAP_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when SubNetwork has no ConnectedAP', () => {
            const doc = parseXMLString(sclXml('<SubNetwork name="SN1"/>'));
            const issues = subNetwork_at_least_one_ConnectedAP_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'SubNetwork_at_least_one_ConnectedAP_required',
                filename: DOC_NAME,
                message: 'SubNetwork shall contain at least one ConnectedAP',
            });
            expect(issues[0].element.getAttribute('name')).toBe('SN1');
        });

        it('should return one issue per faulty SubNetwork', () => {
            const doc = parseXMLString(sclXml(
                '<SubNetwork name="SN1"/><SubNetwork name="SN2"><ConnectedAP iedName="I" apName="A"/></SubNetwork>'
            ));
            const issues = subNetwork_at_least_one_ConnectedAP_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('name')).toBe('SN1');
        });
    });
});
