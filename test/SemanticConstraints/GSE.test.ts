import { describe, expect, it } from 'vitest';

import { GSE_for_L2_GOOSE_has_right_addresses } from '../../src/SemanticConstraints/GSE';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

// Common IED with GSEControl and Communication setup
const IED_WITH_GSECONTROL = `
<IED name="IED1">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <GSEControl name="GC1" type="GOOSE" confRev="1" />
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const IED_WITH_GSECONTROL_AND_PROTOCOL = `
<IED name="IED2">
    <AccessPoint name="AP1">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <GSEControl name="GC1" type="GOOSE" confRev="1" >
                        <Protocol>
                            <P type="some-protocol"/>
                        </Protocol>
                    </GSEControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

// Valid GSE element with ldInst for L2 GOOSE
const VALID_L2_GOOSE_GSE = `
<GSE cbName="GC1" ldInst="LD1">
    <Address>
        <P type="VLAN-ID">1</P>
        <P type="APPID">2</P>
        <P type="VLAN-PRIORITY">3</P>
        <P type="MAC-Address">01-02-03-04-05-06</P>
    </Address>
</GSE>`;

// Valid GSE element for R-GOOSE (with Protocol)
const VALID_R_GOOSE_GSE = `
<GSE cbName="GC1" ldInst="LD1">
    <Address>
        <P type="VLAN-ID">1</P>
    </Address>
</GSE>`;

describe('GSE', () => {
    describe('GSE_for_L2_GOOSE_has_right_addresses', () => {
        it('should return no issues for L2 GOOSE with all required address types and unique types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                ${VALID_L2_GOOSE_GSE}
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for R-GOOSE with Protocol element', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL_AND_PROTOCOL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED2" apName="AP1">
                                ${VALID_R_GOOSE_GSE}
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues for GSE without Address element', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE"/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when L2 GOOSE has all required types with extra types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                        <P type="MAC-Address">01-02-03-04-05-06</P>
                                        <P type="MIN_TIME">1000</P>
                                        <P type="MAX_TIME">2000</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME)).toEqual([]);
        });

        it('should report L2 GOOSE missing VLAN-ID', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="APPID">2</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                        <P type="MAC-Address">01-02-03-04-05-06</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'GSE_for_L2_GOOSE_has_right_addresses',
                filename: DOC_NAME,
                message: 'GSE for L2 GOOSE should have APPID VLAN_ID VLAN-PRIORITY and MAC-Address',
            });
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report L2 GOOSE missing APPID', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                        <P type="MAC-Address">01-02-03-04-05-06</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report L2 GOOSE missing VLAN-PRIORITY', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                        <P type="MAC-Address">01-02-03-04-05-06</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report L2 GOOSE missing MAC-Address', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report L2 GOOSE with duplicate P types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                        <P type="VLAN-ID">4</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('GSE');
        });

        it('should report multiple invalid GSE elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${IED_WITH_GSECONTROL}
                    <IED name="IED2">
                        <AccessPoint name="AP2">
                            <Server>
                                <LDevice inst="LD2">
                                    <LN0 lnClass="LLN0" inst="">
                                        <GSEControl name="GC2" type="GOOSE" confRev="1" >
                                            <GSE cbName="GC2" type="GOOSE" />
                                        </GSEControl>
                                    </LN0>
                                </LDevice>
                            </Server>
                        </AccessPoint>
                    </IED>
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <GSE cbName="GC1" ldInst="LD1" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                        <P type="VLAN-PRIORITY">3</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP2">
                                <GSE cbName="GC2" ldInst="LD2" type="GOOSE">
                                    <Address>
                                        <P type="VLAN-ID">1</P>
                                        <P type="APPID">2</P>
                                    </Address>
                                </GSE>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every((issue) => issue.element.tagName === 'GSE')).toBe(true);
        });

        it('should return no issues when R-GOOSE and L2 GOOSE are both valid', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                ${VALID_L2_GOOSE_GSE}
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP1">
                                ${VALID_R_GOOSE_GSE}
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                    ${IED_WITH_GSECONTROL}
                    ${IED_WITH_GSECONTROL_AND_PROTOCOL}
                </SCL>`);
            expect(GSE_for_L2_GOOSE_has_right_addresses(doc, DOC_NAME)).toEqual([]);
        });
    });
});
