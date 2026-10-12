import { describe, expect, it } from 'vitest';

import {
    association_kind_required,
    association_associationID_valid,
    association_prefix_valid,
    association_lnClass_required,
    association_lnClass_valid,
    association_lnInst_required,
    association_lnInst_valid,
    association_iedName_required,
    association_iedName_valid,
    association_ldInst_required,
    association_ldInst_valid
} from '../../src/RequiredAttributes/Association';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        ${content}
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('Association - RequiredAttributes', () => {
    describe('association_kind_required', () => {
        it('should return no issues when Association has kind attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_kind_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Association has no kind attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_kind_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_kind_required',
                filename: DOC_NAME,
                message: 'kind attribute shall be present in Association',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });

        it('should return one issue per Association without kind', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>' +
                '<Association lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_kind_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('Association');
        });
    });

    describe('association_associationID_valid', () => {
        it('should return no issues when associationID is valid', () => {
            const doc = parseXMLString(sclXml(
                '<Association associationID="Valid123" kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_associationID_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when associationID is empty', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_associationID_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when associationID is too long', () => {
            const longId = 'A'.repeat(129);
            const doc = parseXMLString(sclXml(
                `<Association associationID="${longId}" kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>`
            ));
            const issues = association_associationID_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_associationID_valid',
                filename: DOC_NAME,
                message: 'associationID attribute shall be valid in Association',
            });
        });
    });

    describe('association_prefix_valid', () => {
        it('should return no issues when prefix is valid', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" prefix="P" lnClass="MMXU" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_prefix_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when prefix is empty', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_prefix_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when prefix contains invalid characters', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" prefix="@Invalid" lnClass="MMXU" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_prefix_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_prefix_valid',
                filename: DOC_NAME,
                message: 'prefix attribute shall be valid in Association',
            });
        });
    });

    describe('association_lnClass_required', () => {
        it('should return no issues when Association has lnClass attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnClass_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Association has no lnClass attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_lnClass_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_lnClass_required',
                filename: DOC_NAME,
                message: 'lnClass attribute shall be present in Association',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });
    });

    describe('association_lnClass_valid', () => {
        it('should return no issues when lnClass is a valid predefined class', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="MMXU" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnClass_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when lnClass is a valid extension class', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="TEST" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnClass_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when lnClass is invalid', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="INVALID" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_lnClass_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_lnClass_valid',
                filename: DOC_NAME,
                message: 'lnClass attribute shall be valid in Association',
            });
        });

        it('should return an issue when lnClass is lowercase', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="mmxu" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_lnClass_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_lnClass_valid',
            });
        });

        it('should return no issues when lnClass is LLN0', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnClass_valid(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('association_lnInst_required', () => {
        it('should return no issues when Association has lnInst attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="MMXU" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnInst_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Association has no lnInst attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="MMXU" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_lnInst_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_lnInst_required',
                filename: DOC_NAME,
                message: 'lnInst attribute shall be present in Association',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });
    });

    describe('association_lnInst_valid', () => {
        it('should return no issues when lnInst is valid', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="MMXU" lnInst="1" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when lnInst is empty', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_lnInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when lnInst contains invalid characters', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="MMXU" lnInst="Invalid!" iedName="IED1" ldInst="LD1"/>'
            ));
            const issues = association_lnInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_lnInst_valid',
                filename: DOC_NAME,
                message: 'lnInst attribute shall be valid in Association',
            });
        });
    });

    describe('association_iedName_required', () => {
        it('should return no issues when Association has iedName attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_iedName_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Association has no iedName attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" ldInst="LD1"/>'
            ));
            const issues = association_iedName_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_iedName_required',
                filename: DOC_NAME,
                message: 'iedName attribute shall be present in Association',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });
    });

    describe('association_iedName_valid', () => {
        it('should return no issues when iedName is valid', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="ValidIED" ldInst="LD1"/>'
            ));
            expect(association_iedName_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when iedName contains valid special characters', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED-123@Test" ldInst="LD1"/>'
            ));
            expect(association_iedName_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when iedName contains spaces', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED Name" ldInst="LD1"/>'
            ));
            expect(association_iedName_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when iedName is 129 characters long', () => {
            const longName = 'A'.repeat(129);
            const doc = parseXMLString(sclXml(
                `<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="${longName}" ldInst="LD1"/>`
            ));
            expect(association_iedName_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when iedName is empty', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="" ldInst="LD1"/>'
            ));
            const issues = association_iedName_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_iedName_valid',
                filename: DOC_NAME,
                message: 'iedName attribute shall be valid in Association',
            });
        });

        it('should return an issue when iedName is too long', () => {
            const longName = 'A'.repeat(130);
            const doc = parseXMLString(sclXml(
                `<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="${longName}" ldInst="LD1"/>`
            ));
            const issues = association_iedName_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_iedName_valid',
            });
        });

        it('should return an issue when iedName contains non-basic Latin characters', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED\u0080Name" ldInst="LD1"/>'
            ));
            const issues = association_iedName_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_iedName_valid',
            });
        });
    });

    describe('association_ldInst_required', () => {
        it('should return no issues when Association has ldInst attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_ldInst_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Association has no ldInst attribute', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1"/>'
            ));
            const issues = association_ldInst_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_required',
                filename: DOC_NAME,
                message: 'ldInst attribute shall be present in Association',
            });
            expect(issues[0].element.tagName).toBe('Association');
        });
    });

    describe('association_ldInst_valid', () => {
        it('should return no issues when ldInst is valid starting with letter', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD1"/>'
            ));
            expect(association_ldInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ldInst is valid starting with number', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="1LD"/>'
            ));
            expect(association_ldInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ldInst is exactly 64 characters', () => {
            const longInst = 'A' + '1'.repeat(63);
            const doc = parseXMLString(sclXml(
                `<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="${longInst}"/>`
            ));
            expect(association_ldInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ldInst contains alphanumeric and underscore', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD_123"/>'
            ));
            expect(association_ldInst_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when ldInst is empty', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst=""/>'
            ));
            const issues = association_ldInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_valid',
                filename: DOC_NAME,
                message: 'ldInst attribute shall be valid in Association',
            });
        });

        it('should return an issue when ldInst is too long', () => {
            const longInst = 'A' + '1'.repeat(64);
            const doc = parseXMLString(sclXml(
                `<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="${longInst}"/>`
            ));
            const issues = association_ldInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_valid',
            });
        });

        it('should return an issue when ldInst starts with underscore', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="_LD1"/>'
            ));
            const issues = association_ldInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_valid',
            });
        });

        it('should return an issue when ldInst starts with special character', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="@LD1"/>'
            ));
            const issues = association_ldInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_valid',
            });
        });

        it('should return an issue when ldInst contains special characters', () => {
            const doc = parseXMLString(sclXml(
                '<Association kind="pre-established" lnClass="LLN0" lnInst="" iedName="IED1" ldInst="LD-123"/>'
            ));
            const issues = association_ldInst_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Association_ldInst_valid',
            });
        });
    });
});