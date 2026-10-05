import { describe, expect, it } from 'vitest';

import { inputs_at_least_one_ExtRef_required } from '../../src/RequiredElements/Inputs';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(inputs: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst="">
                                ${inputs}
                            </LN0>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('Inputs', () => {
    describe('inputs_at_least_one_ExtRef_required', () => {
        it('should return no issues when Inputs has an ExtRef', () => {
            const doc = parseXMLString(sclXml(
                '<Inputs><ExtRef iedName="IED2" ldInst="LD1" lnClass="LLN0" doName="X"/></Inputs>'
            ));
            expect(inputs_at_least_one_ExtRef_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Inputs has no ExtRef', () => {
            const doc = parseXMLString(sclXml('<Inputs/>'));
            const issues = inputs_at_least_one_ExtRef_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Inputs_at_least_one_ExtRef_required',
                filename: DOC_NAME,
                message: 'Inputs shall contain at least one ExtRef',
            });
            expect(issues[0].element.tagName).toBe('Inputs');
        });

        it('should return no issues when there is no Inputs element', () => {
            const doc = parseXMLString(sclXml(''));
            expect(inputs_at_least_one_ExtRef_required(doc, DOC_NAME)).toEqual([]);
        });
    });
});
