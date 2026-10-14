import { describe, expect, it } from 'vitest';

import { ControlBlock_RefersToControlWithIEDName } from '../../src/SemanticConstraints/ControlBlock';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('ControlBlock', () => {
    describe('ControlBlock_RefersToControlWithIEDName', () => {
        it('should return no issues when GSE refers to an existing GSEControl', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC1" type="GOOSE" appID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when SMV refers to an existing SampledValueControl', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <SMV cbName="SVC1" ldInst="LD1"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <SampledValueControl name="SVC1" mult="1" smvID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there are no ControlBlock elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1"/>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst=""/>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            expect(ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME)).toEqual([]);
        });

        it('should report GSE referring to a missing GSEControl', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="MISSING" ldInst="LD1"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC1" type="GOOSE" appID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ControlBlock_RefersToControlWithIEDName',
                filename: DOC_NAME,
                message: 'ControlBlock does not refer an existing Control',
            });
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report SMV referring to a missing SampledValueControl', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <SMV cbName="MISSING" ldInst="LD1"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <SampledValueControl name="SVC1" mult="1" smvID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ControlBlock_RefersToControlWithIEDName');
            expect(issues[0].element.tagName).toBe('SMV');
        });

        it('should report GSE with wrong ldInst', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="WRONG"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC1" type="GOOSE" appID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ControlBlock_RefersToControlWithIEDName');
        });

        it('should report GSE with wrong IED reference', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="WRONG" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <LDevice inst="LD1">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC1" type="GOOSE" appID="1"/>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ControlBlock_RefersToControlWithIEDName(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ControlBlock_RefersToControlWithIEDName');
        });
    });
});
