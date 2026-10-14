import { describe, expect, it } from 'vitest';

import { Association_RefersToAnyLN } from '../../src/SemanticConstraints/Association';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithAssociation(association: string, extraIeds = ''): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="LLN0" inst=""/>
                        </LDevice>
                        ${association}
                    </Server>
                </AccessPoint>
            </IED>
            ${extraIeds}
        </SCL>`;
}

const RECEIVER_IED = `<IED name="IED2">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN prefix="P" lnClass="MMXU" inst="1" lnType="T1"/>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

describe('Association', () => {
    describe('Association_RefersToAnyLN', () => {
        it('should return no issues when associationID is not set', () => {
            const doc = parseXMLString(sclWithAssociation(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(Association_RefersToAnyLN(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when the Association refers to an existing LN', () => {
            const doc = parseXMLString(sclWithAssociation(
                '<Association associationID="A1" kind="pre-established" iedName="IED2" ldInst="LD1" prefix="P" lnClass="MMXU" lnInst="1"/>',
                RECEIVER_IED
            ));
            expect(Association_RefersToAnyLN(doc, DOC_NAME)).toEqual([]);
        });

        it('should report an Association referring to a missing LN', () => {
            const doc = parseXMLString(sclWithAssociation(
                '<Association associationID="A1" kind="pre-established" iedName="IED2" ldInst="LD1" prefix="P" lnClass="MMXU" lnInst="2"/>',
                RECEIVER_IED
            ));
            const issues = Association_RefersToAnyLN(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_RefersToAnyLN',
                filename: DOC_NAME,
                message: 'Association (ID=A1) does not refer an existing LN',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });

        it('should report an Association referring to a missing IED', () => {
            const doc = parseXMLString(sclWithAssociation(
                '<Association associationID="A1" kind="pre-established" iedName="MISSING" ldInst="LD1" lnClass="LLN0" lnInst=""/>'
            ));
            const issues = Association_RefersToAnyLN(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Association_RefersToAnyLN');
        });
    });
});
