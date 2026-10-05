import { describe, expect, it } from 'vitest';

import { lDevice_one_LN0_required } from '../../src/RequiredElements/LDevice';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(lDeviceInner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        ${lDeviceInner}
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('LDevice', () => {
    describe('lDevice_one_LN0_required', () => {
        it('should return no issues when LDevice has an LN0', () => {
            const doc = parseXMLString(sclXml(
                '<LDevice inst="LD1"><LN0 lnClass="LLN0" inst=""/></LDevice>'
            ));
            expect(lDevice_one_LN0_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when LDevice has no LN0', () => {
            const doc = parseXMLString(sclXml('<LDevice inst="LD1"/>'));
            const issues = lDevice_one_LN0_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LDevice_one_LN0_required',
                filename: DOC_NAME,
                message: 'LDevice shall contain one LN0',
            });
            expect(issues[0].element.getAttribute('inst')).toBe('LD1');
        });

        it('should return one issue per faulty LDevice', () => {
            const doc = parseXMLString(sclXml(
                '<LDevice inst="LD1"/><LDevice inst="LD2"><LN0 lnClass="LLN0" inst=""/></LDevice>'
            ));
            const issues = lDevice_one_LN0_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('inst')).toBe('LD1');
        });
    });
});
