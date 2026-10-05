import { describe, expect, it } from 'vitest';

import { reportControl_one_OptFields_required } from '../../src/RequiredElements/ReportControl';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(reportControlInner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst="">
                                <ReportControl name="RC1" datSet="DS1">
                                    ${reportControlInner}
                                </ReportControl>
                            </LN0>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('ReportControl', () => {
    describe('reportControl_one_OptFields_required', () => {
        it('should return no issues when ReportControl has an OptFields', () => {
            const doc = parseXMLString(sclXml('<OptFields/>'));
            expect(reportControl_one_OptFields_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when ReportControl has no OptFields', () => {
            const doc = parseXMLString(sclXml(''));
            const issues = reportControl_one_OptFields_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ReportControl_one_OptFields_required',
                filename: DOC_NAME,
                message: 'ReportControl shall contain an OptFields',
            });
            expect(issues[0].element.tagName).toBe('ReportControl');
        });
    });
});
