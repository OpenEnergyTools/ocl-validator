import { describe, expect, it } from 'vitest';

import { history_at_least_one_Hitem_required } from '../../src/RequiredElements/History';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(history: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            ${history}
        </SCL>`;
}

describe('History', () => {
    describe('history_at_least_one_Hitem_required', () => {
        it('should return no issues when History has a Hitem', () => {
            const doc = parseXMLString(sclXml(
                '<History><Hitem version="1" revision="0" when="now" what="created" who="me"/></History>'
            ));
            expect(history_at_least_one_Hitem_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when History has no Hitem', () => {
            const doc = parseXMLString(sclXml('<History/>'));
            const issues = history_at_least_one_Hitem_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'History_at_least_one_Hitem_required',
                filename: DOC_NAME,
                message: 'History shall contain at least one Hitem',
            });
            expect(issues[0].element.tagName).toBe('History');
        });

        it('should return no issues when there is no History element', () => {
            const doc = parseXMLString(sclXml(''));
            expect(history_at_least_one_Hitem_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
