import { describe, expect, it } from 'vitest';

import {
    ln_lnClass_required,
    ln_lnClass_valid,
    ln_inst_required,
    anyLn_lnType_required,
    anyLn_lnType_valid
} from '../../src/RequiredAttributes/AnyLN';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclXml(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    ${content}
                </AccessPoint>
            </IED>
        </SCL>`;
}

function sclXmlWithServer(content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B" release="4">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            ${content}
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('AnyLN', () => {
    describe('ln_lnClass_required', () => {
        it('should return no issues when LN under AccessPoint has lnClass', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType="Node"/>'));
            expect(ln_lnClass_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN under LDevice has lnClass', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN lnClass="MMXU" inst="1" lnType="Node"/>'));
            expect(ln_lnClass_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN0 under LDevice has lnClass', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN0 lnClass="LLN0" inst="" lnType="Node"/>'));
            expect(ln_lnClass_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when LN under AccessPoint has no lnClass', () => {
            const doc = parseXMLString(sclXml('<LN inst="1" lnType="Node"/>'));
            const issues = ln_lnClass_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_lnClass_required',
                filename: DOC_NAME,
                message: 'lnClass attribute shall be present in AnyLN',
            });
            expect(issues[0].element.tagName).toBe('LN');
        });

        it('should return an issue when LN under LDevice has no lnClass', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN inst="1" lnType="Node"/>'));
            const issues = ln_lnClass_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('LN');
        });

        it('should return an issue when LN0 under LDevice has no lnClass', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN0 inst="" lnType="Node"/>'));
            const issues = ln_lnClass_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('LN0');
        });
    });

    describe('ln_lnClass_valid', () => {
        it('should return no issues when lnClass is a valid predefined value', () => {
            const validClasses = ['LLN0', 'MMXU', 'CSWI', 'XCBR', 'GGIO', 'LLN0', 'LPHD', 'LCCH', 'LGOS'];
            validClasses.forEach(lnClass => {
                const doc = parseXMLString(sclXml(`<LN lnClass="${lnClass}" inst="1" lnType="Node"/>`));
                expect(ln_lnClass_valid(doc, DOC_NAME)).toEqual([]);
            });
        });

        it('should return no issues for domain-specific lnClass values', () => {
            const domainClasses = ['ANCR', 'ARCO', 'GAPC', 'GLOG', 'IARC', 'MHAI', 'PTOC', 'RREC', 'XCBR', 'YEFN', 'ZAXN'];
            domainClasses.forEach(lnClass => {
                const doc = parseXMLString(sclXml(`<LN lnClass="${lnClass}" inst="1" lnType="Node"/>`));
                expect(ln_lnClass_valid(doc, DOC_NAME)).toEqual([]);
            });
        });

        it('should return no issues when lnClass matches the pattern (4 uppercase letters)', () => {
            const validPatternClasses = ['ABCD', 'XYZZ', 'WXYZ', 'LMNO'];
            validPatternClasses.forEach(lnClass => {
                const doc = parseXMLString(sclXml(`<LN lnClass="${lnClass}" inst="1" lnType="Node"/>`));
                expect(ln_lnClass_valid(doc, DOC_NAME)).toEqual([]);
            });
        });

        it('should return an issue when lnClass has wrong length (not 4 chars)', () => {
            const invalidPatternClasses = ['ABC', 'ABCDE', 'AB', 'A'];
            invalidPatternClasses.forEach(lnClass => {
                const doc = parseXMLString(sclXml(`<LN lnClass="${lnClass}" inst="1" lnType="Node"/>`));
                const issues = ln_lnClass_valid(doc, DOC_NAME);
                expect(issues).toHaveLength(1);
                expect(issues[0]).toMatchObject({
                    severity: 'ERROR',
                    id: 'LN_lnClass_valid',
                    filename: DOC_NAME,
                    message: 'lnClass attribute shall be valid in AnyLN',
                });
            });
        });

        it('should return an issue when lnClass has digits', () => {
            const invalidPatternClasses = ['X1', 'Y2Z', 'A1B2'];
            invalidPatternClasses.forEach(lnClass => {
                const doc = parseXMLString(sclXml(`<LN lnClass="${lnClass}" inst="1" lnType="Node"/>`));
                const issues = ln_lnClass_valid(doc, DOC_NAME);
                expect(issues).toHaveLength(1);
                expect(issues[0]).toMatchObject({
                    severity: 'ERROR',
                    id: 'LN_lnClass_valid',
                    filename: DOC_NAME,
                    message: 'lnClass attribute shall be valid in AnyLN',
                });
            });
        });

        it('should return an issue when lnClass is empty', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="" inst="1" lnType="Node"/>'));
            const issues = ln_lnClass_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_lnClass_valid',
                filename: DOC_NAME,
                message: 'lnClass attribute shall be valid in AnyLN',
            });
        });

        it('should return an issue when lnClass is invalid', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="INVALID" inst="1" lnType="Node"/>'));
            const issues = ln_lnClass_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_lnClass_valid',
                filename: DOC_NAME,
                message: 'lnClass attribute shall be valid in AnyLN',
            });
        });

        it('should return an issue when lnClass has lowercase letters', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="mmxu" inst="1" lnType="Node"/>'));
            const issues = ln_lnClass_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should return no issues when lnClass is not present', () => {
            const doc = parseXMLString(sclXml('<LN inst="1" lnType="Node"/>'));
            expect(ln_lnClass_valid(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('ln_inst_required', () => {
        it('should return no issues when LN under AccessPoint has inst', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType="Node"/>'));
            expect(ln_inst_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN under LDevice has inst', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN lnClass="MMXU" inst="1" lnType="Node"/>'));
            expect(ln_inst_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN0 under LDevice has empty inst', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN0 lnClass="LLN0" inst="" lnType="Node"/>'));
            expect(ln_inst_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when LN has no inst', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" lnType="Node"/>'));
            const issues = ln_inst_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_inst_required',
                filename: DOC_NAME,
                message: 'inst attribute shall be present in AnyLN',
            });
        });
    });

    describe('anyLn_lnType_required', () => {
        it('should return no issues when LN has lnType', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType="Node"/>'));
            expect(anyLn_lnType_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when LN0 has lnType', () => {
            const doc = parseXMLString(sclXmlWithServer('<LN0 lnClass="LLN0" inst="" lnType="Node"/>'));
            expect(anyLn_lnType_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when LN has no lnType', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1"/>'));
            const issues = anyLn_lnType_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_lnType_required',
                filename: DOC_NAME,
                message: 'lnType attribute shall be present in AnyLN',
            });
        });
    });

    describe('anyLn_lnType_valid', () => {
        it('should return no issues when lnType is valid', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType="ValidType"/>'));
            expect(anyLn_lnType_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for lnType with maximum length (128 chars)', () => {
            const longType = 'a'.repeat(128);
            const doc = parseXMLString(sclXml(`<LN lnClass="MMXU" inst="1" lnType="${longType}"/>`));
            expect(anyLn_lnType_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for lnType with minimum length (1 char)', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType="a"/>'));
            expect(anyLn_lnType_valid(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when lnType is empty', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1" lnType=""/>'));
            const issues = anyLn_lnType_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_lnType_valid',
                filename: DOC_NAME,
                message: 'lnType attribute shall be valid in AnyLN',
            });
        });

        it('should return an issue when lnType is too long (over 128 chars)', () => {
            const longType = 'a'.repeat(129);
            const doc = parseXMLString(sclXml(`<LN lnClass="MMXU" inst="1" lnType="${longType}"/>`));
            const issues = anyLn_lnType_valid(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_lnType_valid',
                filename: DOC_NAME,
                message: 'lnType attribute shall be valid in AnyLN',
            });
        });

        it('should return no issues when lnType is not present', () => {
            const doc = parseXMLString(sclXml('<LN lnClass="MMXU" inst="1"/>'));
            expect(anyLn_lnType_valid(doc, DOC_NAME)).toEqual([]);
        });
    });
});
