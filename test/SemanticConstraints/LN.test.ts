import { describe, expect, it } from 'vitest';

import {
    lN_unique_name_in_ReportControl,
    lN_unique_datSet_in_ReportControl,
    lN_unique_name_in_LogControl,
    lN_unique_datSet_in_LogControl,
    lN_unique_name_in_DataSet,
    lN_unique_name_in_DOI,
    lN_unique_name_in_Log
} from '../../src/SemanticConstraints/LN';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithLN(lnContent: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="1">
                            <LN lnClass="MMXU" inst="1" lnType="LNType1">
                                ${lnContent}
                            </LN>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('LN', () => {
    describe('lN_unique_name_in_ReportControl', () => {
        it('should return no issues when ReportControl names are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC2" datSet="DS2"/>'
            ));
            expect(lN_unique_name_in_ReportControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there is a single ReportControl', () => {
            const doc = parseXMLString(sclWithLN('<ReportControl name="RC1" datSet="DS1"/>'));
            expect(lN_unique_name_in_ReportControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate ReportControl names', () => {
            const doc = parseXMLString(sclWithLN(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC1" datSet="DS2"/>'
            ));
            const issues = lN_unique_name_in_ReportControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_name_in_ReportControl',
                filename: DOC_NAME,
                message: 'Unique name in ReportControl from LN',
            });
            expect(issues[0].element.tagName).toBe('LN');
        });
    });

    describe('lN_unique_datSet_in_ReportControl', () => {
        it('should return no issues when ReportControl datSet values are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC2" datSet="DS2"/>'
            ));
            expect(lN_unique_datSet_in_ReportControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate ReportControl datSet values', () => {
            const doc = parseXMLString(sclWithLN(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC2" datSet="DS1"/>'
            ));
            const issues = lN_unique_datSet_in_ReportControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_datSet_in_ReportControl',
                filename: DOC_NAME,
                message: 'Unique datSet in ReportControl from LN',
            });
        });
    });

    describe('lN_unique_name_in_LogControl', () => {
        it('should return no issues when LogControl names are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC2" datSet="DS2"/>'
            ));
            expect(lN_unique_name_in_LogControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate LogControl names', () => {
            const doc = parseXMLString(sclWithLN(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC1" datSet="DS2"/>'
            ));
            const issues = lN_unique_name_in_LogControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_name_in_LogControl',
                filename: DOC_NAME,
                message: 'Unique name in LogControl from LN',
            });
        });
    });

    describe('lN_unique_datSet_in_LogControl', () => {
        it('should return no issues when LogControl datSet values are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC2" datSet="DS2"/>'
            ));
            expect(lN_unique_datSet_in_LogControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate LogControl datSet values', () => {
            const doc = parseXMLString(sclWithLN(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC2" datSet="DS1"/>'
            ));
            const issues = lN_unique_datSet_in_LogControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_datSet_in_LogControl',
                filename: DOC_NAME,
                message: 'Unique datSet in LogControl from LN',
            });
        });
    });

    describe('lN_unique_name_in_DataSet', () => {
        it('should return no issues when DataSet names are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<DataSet name="DS1"/><DataSet name="DS2"/>'
            ));
            expect(lN_unique_name_in_DataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DataSet names', () => {
            const doc = parseXMLString(sclWithLN(
                '<DataSet name="DS1"/><DataSet name="DS1"/>'
            ));
            const issues = lN_unique_name_in_DataSet(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_name_in_DataSet',
                filename: DOC_NAME,
                message: 'Unique name in DataSet from LN',
            });
        });
    });

    describe('lN_unique_name_in_DOI', () => {
        it('should return no issues when DOI names are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<DOI name="DOI1"/><DOI name="DOI2"/>'
            ));
            expect(lN_unique_name_in_DOI(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DOI names', () => {
            const doc = parseXMLString(sclWithLN(
                '<DOI name="DOI1"/><DOI name="DOI1"/>'
            ));
            const issues = lN_unique_name_in_DOI(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_name_in_DOI',
                filename: DOC_NAME,
                message: 'Unique name in DOI from LN',
            });
        });
    });

    describe('lN_unique_name_in_Log', () => {
        it('should return no issues when Log names are unique', () => {
            const doc = parseXMLString(sclWithLN(
                '<Log name="Log1"/><Log name="Log2"/>'
            ));
            expect(lN_unique_name_in_Log(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate Log names', () => {
            const doc = parseXMLString(sclWithLN(
                '<Log name="Log1"/><Log name="Log1"/>'
            ));
            const issues = lN_unique_name_in_Log(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN_unique_name_in_Log',
                filename: DOC_NAME,
                message: 'Unique name in Log from LN',
            });
        });
    });
});
