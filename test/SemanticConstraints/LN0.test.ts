import { describe, expect, it } from 'vitest';

import {
    lN0_GSEControl_name_unique,
    lN0_SampledValueControl_name_unique,
    lN0_name_in_ReportControl,
    lN0_name_in_LogControl,
    lN0_name_in_DataSet,
    lN0_name_in_DOI,
    lN0_name_in_Log
} from '../../src/SemanticConstraints/LN0';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithLN0(ln0Content: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <LDevice inst="1">
                            <LN0 lnClass="LLN0" inst="" lnType="LN0Type1">
                                ${ln0Content}
                            </LN0>
                        </LDevice>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('LN0', () => {
    describe('lN0_GSEControl_name_unique', () => {
        it('should return no issues when GSEControl names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<GSEControl name="GC1" type="GOOSE"/><GSEControl name="GC2" type="GOOSE"/>'
            ));
            expect(lN0_GSEControl_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there is a single GSEControl', () => {
            const doc = parseXMLString(sclWithLN0('<GSEControl name="GC1" type="GOOSE"/>'));
            expect(lN0_GSEControl_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate GSEControl names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<GSEControl name="GC1" type="GOOSE"/><GSEControl name="GC1" type="GOOSE"/>'
            ));
            const issues = lN0_GSEControl_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_GSEControl_name_unique',
                filename: DOC_NAME,
                message: 'Unique name in GSEControl from LN0',
            });
            expect(issues[0].element.tagName).toBe('LN0');
        });
    });

    describe('lN0_SampledValueControl_name_unique', () => {
        it('should return no issues when SampledValueControl names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<SampledValueControl name="SVC1" smvID="SMV1"/><SampledValueControl name="SVC2" smvID="SMV2"/>'
            ));
            expect(lN0_SampledValueControl_name_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate SampledValueControl names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<SampledValueControl name="SVC1" smvID="SMV1"/><SampledValueControl name="SVC1" smvID="SMV2"/>'
            ));
            const issues = lN0_SampledValueControl_name_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_SampledValueControl_name_unique',
                filename: DOC_NAME,
                message: 'Unique name in SampledValueControl from LN0',
            });
        });
    });

    describe('lN0_name_in_ReportControl', () => {
        it('should return no issues when ReportControl names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC2" datSet="DS2"/>'
            ));
            expect(lN0_name_in_ReportControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate ReportControl names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<ReportControl name="RC1" datSet="DS1"/><ReportControl name="RC1" datSet="DS2"/>'
            ));
            const issues = lN0_name_in_ReportControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_name_in_ReportControl',
                filename: DOC_NAME,
                message: 'Unique name in ReportControl from LN0',
            });
        });
    });

    describe('lN0_name_in_LogControl', () => {
        it('should return no issues when LogControl names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC2" datSet="DS2"/>'
            ));
            expect(lN0_name_in_LogControl(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate LogControl names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<LogControl name="LC1" datSet="DS1"/><LogControl name="LC1" datSet="DS2"/>'
            ));
            const issues = lN0_name_in_LogControl(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_name_in_LogControl',
                filename: DOC_NAME,
                message: 'Unique name in LogControl from LN0',
            });
        });
    });

    describe('lN0_name_in_DataSet', () => {
        it('should return no issues when DataSet names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<DataSet name="DS1"/><DataSet name="DS2"/>'
            ));
            expect(lN0_name_in_DataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DataSet names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<DataSet name="DS1"/><DataSet name="DS1"/>'
            ));
            const issues = lN0_name_in_DataSet(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_name_in_DataSet',
                filename: DOC_NAME,
                message: 'Unique name in DataSet from LN0',
            });
        });
    });

    describe('lN0_name_in_DOI', () => {
        it('should return no issues when DOI names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<DOI name="DOI1"/><DOI name="DOI2"/>'
            ));
            expect(lN0_name_in_DOI(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate DOI names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<DOI name="DOI1"/><DOI name="DOI1"/>'
            ));
            const issues = lN0_name_in_DOI(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_name_in_DOI',
                filename: DOC_NAME,
                message: 'Unique name in DOI from LN0',
            });
        });
    });

    describe('lN0_name_in_Log', () => {
        it('should return no issues when Log names are unique', () => {
            const doc = parseXMLString(sclWithLN0(
                '<Log name="Log1"/><Log name="Log2"/>'
            ));
            expect(lN0_name_in_Log(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate Log names', () => {
            const doc = parseXMLString(sclWithLN0(
                '<Log name="Log1"/><Log name="Log1"/>'
            ));
            const issues = lN0_name_in_Log(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'LN0_name_in_Log',
                filename: DOC_NAME,
                message: 'Unique name in Log from LN0',
            });
        });
    });
});
