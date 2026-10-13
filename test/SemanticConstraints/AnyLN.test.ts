import { describe, expect, it } from 'vitest';

import {
    AnyLN_LogControl_name_unique,
    AnyLN_ReportControl_name_unique,
    AnyLN_Log_name_unique,
    AnyLN_DOI_name_unique,
    AnyLN_LNodeType_lnClass_consistent,
    AnyLN_RefersToLNodeType
} from '../../src/SemanticConstraints/AnyLN';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

/** Wraps inner LN/LN0 content in a minimal SCL structure */
function sclWithLn(lnInner: string, lnTag: 'LN' | 'LN0' = 'LN0'): string {
    const ln = lnTag === 'LN0'
        ? `<LN0 lnClass="LLN0" inst="">${lnInner}</LN0>`
        : `<LN lnClass="MMXU" inst="1" lnType="T1">${lnInner}</LN>`;
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            ${ln}
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

/** Minimal SCL with a DataTypeTemplates section and the given LNodeTypes */
function sclWithTypes(lNodeTypes: string, lnTypeAttr: string, lnClassAttr = 'LLN0'): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="LD1">
                            <LN0 lnClass="${lnClassAttr}" inst="" ${lnTypeAttr}/>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
            <DataTypeTemplates>
                ${lNodeTypes}
            </DataTypeTemplates>
        </SCL>`;
}

describe('AnyLN', () => {
    describe('AnyLN_LogControl_name_unique', () => {
        it('should return no issues when LogControl names are unique', () => {
            const doc = parseXMLString(sclWithLn(
                '<LogControl name="LC1"/><LogControl name="LC2"/>'
            ));
            expect(AnyLN_LogControl_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when two LogControls share a name', () => {
            const doc = parseXMLString(sclWithLn(
                '<LogControl name="LC1"/><LogControl name="LC1"/>'
            ));
            const issues = AnyLN_LogControl_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_LogControl_name_unique',
                filename: DOC_NAME,
                message: 'name of the log control block shall be unique within the AnyLN',
            });
            expect(issues[0].element.tagName).toBe('LN0');
        });
    });

    describe('AnyLN_ReportControl_name_unique', () => {
        it('should return no issues when ReportControl names are unique', () => {
            const doc = parseXMLString(sclWithLn(
                '<ReportControl name="RC1"/><ReportControl name="RC2"/>'
            ));
            expect(AnyLN_ReportControl_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when two ReportControls share a name', () => {
            const doc = parseXMLString(sclWithLn(
                '<ReportControl name="RC1"/><ReportControl name="RC1"/>'
            ));
            const issues = AnyLN_ReportControl_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_ReportControl_name_unique',
                filename: DOC_NAME,
                message: 'name of the report control block shall be unique within the AnyLN',
            });
        });
    });

    describe('AnyLN_Log_name_unique', () => {
        it('should return no issues when Log names are unique', () => {
            const doc = parseXMLString(sclWithLn(
                '<Log name="L1"/><Log name="L2"/>'
            ));
            expect(AnyLN_Log_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when two Logs share a name', () => {
            const doc = parseXMLString(sclWithLn('<Log name="L1"/><Log name="L1"/>'));
            const issues = AnyLN_Log_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_Log_name_unique',
                filename: DOC_NAME,
                message: 'name of the Log shall be unique within the AnyLN',
            });
        });
    });

    describe('AnyLN_DOI_name_unique', () => {
        it('should return no issues when DOI names are unique', () => {
            const doc = parseXMLString(sclWithLn(
                '<DOI name="Beh"/><DOI name="Mod"/>'
            ));
            expect(AnyLN_DOI_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there are no DOIs', () => {
            const doc = parseXMLString(sclWithLn(''));
            expect(AnyLN_DOI_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when two DOIs share a name', () => {
            const doc = parseXMLString(sclWithLn('<DOI name="Beh"/><DOI name="Beh"/>'));
            const issues = AnyLN_DOI_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_DOI_name_unique',
                filename: DOC_NAME,
                message: 'name of the DOI shall be unique within the AnyLN',
            });
        });
    });

    describe('AnyLN_LNodeType_lnClass_consistent', () => {
        it('should return no issues when lnClass matches the referenced LNodeType', () => {
            const doc = parseXMLString(sclWithTypes(
                '<LNodeType id="T1" lnClass="LLN0"/>',
                'lnType="T1"'
            ));
            expect(AnyLN_LNodeType_lnClass_consistent(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when lnClass differs from the referenced LNodeType', () => {
            const doc = parseXMLString(sclWithTypes(
                '<LNodeType id="T1" lnClass="MMXU"/>',
                'lnType="T1"',
                'LLN0'
            ));
            const issues = AnyLN_LNodeType_lnClass_consistent(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_LNodeType_lnClass_consistent',
                filename: DOC_NAME,
                message: 'lnClass shall be the same as the referenced LNodeType lnClass',
            });
        });

        it('should return no issues when lnType is not set', () => {
            const doc = parseXMLString(sclWithTypes('<LNodeType id="T1" lnClass="LLN0"/>', ''));
            expect(AnyLN_LNodeType_lnClass_consistent(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('AnyLN_RefersToLNodeType', () => {
        it('should return no issues when lnType references an existing LNodeType', () => {
            const doc = parseXMLString(sclWithTypes(
                '<LNodeType id="T1" lnClass="LLN0"/>',
                'lnType="T1"'
            ));
            expect(AnyLN_RefersToLNodeType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when lnType references a missing LNodeType', () => {
            const doc = parseXMLString(sclWithTypes(
                '<LNodeType id="T1" lnClass="LLN0"/>',
                'lnType="MISSING"'
            ));
            const issues = AnyLN_RefersToLNodeType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AnyLN_RefersToLNodeType',
                filename: DOC_NAME,
                message: 'AnyLN (lnType=MISSING) does not refer an existing LNodeType in DataTypeTemplates section',
            });
        });

        it('should return an issue when lnType is set but there is no DataTypeTemplates section', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="" lnType="T1"/>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = AnyLN_RefersToLNodeType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('AnyLN_RefersToLNodeType');
        });
    });
});
