import { describe, expect, it } from 'vitest';

import { dataSet_at_least_one_FCDA_required } from '../../src/RequiredElements/DataSet';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(dataSet: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst="">
                                ${dataSet}
                            </LN0>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('DataSet', () => {
    describe('dataSet_at_least_one_FCDA_required', () => {
        it('should return no issues when DataSet has an FCDA', () => {
            const doc = parseXMLString(sclXml(
                '<DataSet name="DS1"><FCDA ldInst="LD1" lnClass="LLN0" doName="X" fc="ST"/></DataSet>'
            ));
            expect(dataSet_at_least_one_FCDA_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when DataSet has no FCDA', () => {
            const doc = parseXMLString(sclXml('<DataSet name="DS1"/>'));
            const issues = dataSet_at_least_one_FCDA_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'DataSet_at_least_one_FCDA_required',
                filename: DOC_NAME,
                message: 'DataSet shall contain at least one FCDA',
            });
            expect(issues[0].element.getAttribute('name')).toBe('DS1');
        });

        it('should return no issues when there is no DataSet', () => {
            const doc = parseXMLString(sclXml(''));
            expect(dataSet_at_least_one_FCDA_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
