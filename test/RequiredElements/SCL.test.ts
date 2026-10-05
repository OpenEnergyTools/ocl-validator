import { describe, expect, it } from 'vitest';

import { sCL_one_Header_required } from '../../src/RequiredElements/SCL';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('SCL', () => {
    describe('sCL_one_Header_required', () => {
        it('should return no issues when SCL has a Header', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
                    <Header id="H1"/>
                </SCL>`);
            expect(sCL_one_Header_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when SCL has no Header', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
                    <Substation name="S1"/>
                </SCL>`);
            const issues = sCL_one_Header_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'SCL_one_Header_required',
                filename: DOC_NAME,
                message: 'SCL shall contain an Header',
            });
            // Document-scope violation points at the root element
            expect(issues[0].element.tagName).toBe('SCL');
        });
    });
});
