import { describe, expect, it } from 'vitest';

import {
    Communication_unique_SubNetwork_name,
    Communication_GSE_SMV_MACAddress_unique
} from '../../src/SemanticConstraints/Communication';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function sclWithCommunication(subNetworks: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Communication>
                ${subNetworks}
            </Communication>
        </SCL>`;
}

describe('Communication', () => {
    describe('Communication_unique_SubNetwork_name', () => {
        it('should return no issues when SubNetwork names are unique', () => {
            const doc = parseXMLString(sclWithCommunication(
                '<SubNetwork name="SN1" type="8-MMS"/><SubNetwork name="SN2" type="8-MMS"/>'
            ));
            expect(Communication_unique_SubNetwork_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when there is no Communication section', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>`);
            expect(Communication_unique_SubNetwork_name(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a Communication with duplicate SubNetwork names', () => {
            const doc = parseXMLString(sclWithCommunication(
                '<SubNetwork name="SN1" type="8-MMS"/><SubNetwork name="SN1" type="8-MMS"/>'
            ));
            const issues = Communication_unique_SubNetwork_name(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Communication_unique_SubNetwork_name',
                filename: DOC_NAME,
                message: 'SubNetwork in Communication shall have different name',
            });
            expect(issues[0].element.tagName).toBe('Communication');
        });
    });

    describe('Communication_GSE_SMV_MACAddress_unique', () => {
        it('should return no issues when MAC addresses are unique', () => {
            const doc = parseXMLString(sclWithCommunication(`
                <SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <GSE ldInst="LD1" cbName="GCB1">
                            <Address><P type="MAC-Address">01-0C-CD-01-00-01</P></Address>
                        </GSE>
                        <GSE ldInst="LD1" cbName="GCB2">
                            <Address><P type="MAC-Address">01-0C-CD-01-00-02</P></Address>
                        </GSE>
                    </ConnectedAP>
                </SubNetwork>`));
            expect(Communication_GSE_SMV_MACAddress_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should ignore P elements that are not MAC addresses', () => {
            const doc = parseXMLString(sclWithCommunication(`
                <SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <Address>
                            <P type="IP">10.0.0.1</P>
                            <P type="IP">10.0.0.1</P>
                        </Address>
                    </ConnectedAP>
                </SubNetwork>`));
            expect(Communication_GSE_SMV_MACAddress_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report the second P element with a duplicate MAC address', () => {
            const doc = parseXMLString(sclWithCommunication(`
                <SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <GSE ldInst="LD1" cbName="GCB1">
                            <Address>
                                <P type="MAC-Address">01-0C-CD-01-00-01</P>
                            </Address>
                        </GSE>
                        <SMV ldInst="LD1" cbName="MSVCB1">
                            <Address>
                                <P type="MAC-Address">01-0C-CD-04-00-02</P>
                            </Address>
                        </SMV>
                    </ConnectedAP>
                </SubNetwork>
                <SubNetwork name="SN2" type="8-MMS">
                    <ConnectedAP iedName="IED2" apName="AP2">
                        <GSE ldInst="LD1" cbName="GCB2">
                            <Address>
                                <P type="MAC-Address">01-0C-CD-01-00-01</P>
                            </Address>
                        </GSE>
                        <SMV ldInst="LD1" cbName="MSVCB2">
                            <Address>
                                <P type="MAC-Address">01-0C-CD-04-00-02</P>
                            </Address>
                        </SMV>
                    </ConnectedAP>
                </SubNetwork>`));
            const issues = Communication_GSE_SMV_MACAddress_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Communication_GSE_SMV_MACAddress_unique',
                filename: DOC_NAME,
                message: 'GSE and SMV MAC-Addresses shall be unique in the file',
            });
            expect(issues[0].element.tagName).toBe('P');
            expect(issues[1].element.tagName).toBe('P');
        });
    });
});
