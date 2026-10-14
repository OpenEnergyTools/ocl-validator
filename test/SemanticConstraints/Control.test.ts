import { describe, expect, it } from 'vitest';

import { Control_RefersToDataSet } from '../../src/SemanticConstraints/Control';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('Control', () => {
    describe('Control_RefersToDataSet', () => {
        it('should return no issues when a ReportControl refers to an existing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DataSet name="DS1"/>
                                        <ReportControl name="RC1" datSet="DS1" rptID="1" confRev="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(Control_RefersToDataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when a LogControl refers to an existing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DataSet name="DS1"/>
                                        <LogControl name="LC1" datSet="DS1" logEna="true"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(Control_RefersToDataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there are no Control elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <DataSet name="DS1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(Control_RefersToDataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a ReportControl referring to a missing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <ReportControl name="RC1" datSet="MISSING" rptID="1" confRev="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = Control_RefersToDataSet(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Control_RefersToDataSet',
                filename: DOC_NAME,
                message: 'Control (name=RC1) does not refer an existing DataSet',
            });
            expect(issues[0].element.tagName).toBe('ReportControl');
        });

        it('should report a GSEControl referring to a missing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC1" datSet="MISSING" type="GOOSE" appID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = Control_RefersToDataSet(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Control_RefersToDataSet');
            expect(issues[0].element.tagName).toBe('GSEControl');
        });

        it('should return no issues when datSet is not set', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <ReportControl name="RC1" rptID="1" confRev="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(Control_RefersToDataSet(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a SampledValueControl referring to a missing DataSet', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <SampledValueControl name="SVC1" datSet="MISSING" mult="1" smvID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = Control_RefersToDataSet(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('Control_RefersToDataSet');
            expect(issues[0].element.tagName).toMatch(/^(ReportControl|LogControl|GSEControl|SampledValueControl)$/);
        });
    });
});
