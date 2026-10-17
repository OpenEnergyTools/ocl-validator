import { describe, expect, it } from 'vitest';

import { ClientLN_RefersToLNodeType, ClientLN_Sender_and_receiver_not_in_same_subnetwork } from '../../src/SemanticConstraints/ClientLN';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

const SERVER_IED = `<IED name="ServerIED">
    <AccessPoint name="ServerAP">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <ReportControl name="RC1" rptID="1" confRev="1">
                        <RptEnabled name="RP1" max="10">
                            <ClientLN apRef="ClientAP" iedName="ClientIED" prefix="P" lnClass="MMXU" lnInst="1"/>
                        </RptEnabled>
                    </ReportControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const SERVER_IED_WO_apRef = `<IED name="ServerIED">
    <AccessPoint name="ServerAP">
        <Server>
            <LDevice inst="LD1">
                <LN0 lnClass="LLN0" inst="">
                    <ReportControl name="RC1" rptID="1" confRev="1">
                        <RptEnabled name="RP1" max="10">
                            <ClientLN iedName="ClientIED" prefix="P" lnClass="MMXU" lnInst="1"/>
                        </RptEnabled>
                    </ReportControl>
                </LN0>
            </LDevice>
        </Server>
    </AccessPoint>
</IED>`;

const CLIENT_IED = `<IED name="ClientIED">
    <AccessPoint name="ClientAP">
        <LN prefix="P" lnClass="MMXU" inst="1" lnType="T1"/>
    </AccessPoint>
</IED>`;

const CLIENT_MULTIPLE_IED = `<IED name="ClientIED">
    <AccessPoint name="AP1">
        <LN prefix="P" lnClass="MMXU" inst="1" lnType="T1"/>
    </AccessPoint>
    <AccessPoint name="AP2">
        <LN prefix="P" lnClass="MMXU" inst="1" lnType="T1"/>
    </AccessPoint>
</IED>`;

describe('ClientLN', () => {
    describe('ClientLN_RefersToLNodeType', () => {
        it('should return no issues when ClientLN refers to an existing LN', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            expect(ClientLN_RefersToLNodeType(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when ClientLN refers to an existing LN in multi AccP Client IED', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED_WO_apRef}
                    ${CLIENT_MULTIPLE_IED}
                </SCL>`);
            expect(ClientLN_RefersToLNodeType(doc, DOC_NAME)).toEqual([]);
        });

        it('should report ClientLN referring to a missing LN', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED}
                    <IED name="ClientIED">
                        <AccessPoint name="ClientAP">
                            <LN prefix="P" lnClass="MMXU" inst="2" lnType="T1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ClientLN_RefersToLNodeType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ClientLN_RefersToLNodeType',
                filename: DOC_NAME,
                message: 'ClientLN does not refer an existing LN',
            });
            expect(issues[0].element.tagName).toBe('ClientLN');
        });

        it('should report ClientLN referring to a missing IED', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED}
                </SCL>`);
            const issues = ClientLN_RefersToLNodeType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ClientLN_RefersToLNodeType');
        });

        it('should report ClientLN with wrong prefix', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED}
                    <IED name="ReceiverIED">
                        <AccessPoint name="ReceiverAP">
                            <LN lnClass="MMXU" inst="1" lnType="T1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`);
            const issues = ClientLN_RefersToLNodeType(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ClientLN_RefersToLNodeType');
        });
    });

    describe('ClientLN_Sender_and_receiver_not_in_same_subnetwork', () => {
        const communicationWithSubnets = `<Communication>
            <SubNetwork name="Subnet1" type="8-MMS">
                <ConnectedAP iedName="ServerIED" apName="ServerAP"/>
            </SubNetwork>
            <SubNetwork name="Subnet2" type="8-MMS">
                <ConnectedAP iedName="ClientIED" apName="ClientAP"/>
            </SubNetwork>
        </Communication>`;

        const communicationSameSubnet = `<Communication>
            <SubNetwork name="Subnet1" type="8-MMS">
                <ConnectedAP iedName="ServerIED" apName="ServerAP"/>
                <ConnectedAP iedName="ClientIED" apName="ClientAP"/>
            </SubNetwork>
        </Communication>`;

        it('should return no issues when sender and receiver are in the same subnetwork', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${communicationSameSubnet}
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            expect(ClientLN_Sender_and_receiver_not_in_same_subnetwork(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when no Communication section exists', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            expect(ClientLN_Sender_and_receiver_not_in_same_subnetwork(doc, DOC_NAME)).toEqual([]);
        });

        it('should report when sender and receiver are in different subnetworks', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    ${communicationWithSubnets}
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            const issues = ClientLN_Sender_and_receiver_not_in_same_subnetwork(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ClientLN_Sender_and_receiver_not_in_same_subnetwork',
                filename: DOC_NAME,
                message: 'Sender and receiver of the Report are not in the same Subnetwork',
            });
            expect(issues[0].element.tagName).toBe('ClientLN');
        });

        it('should report when ConnectedAP for client is missing', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="ServerIED" apName="ServerAP"/>
                        </SubNetwork>
                    </Communication>
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            const issues = ClientLN_Sender_and_receiver_not_in_same_subnetwork(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ClientLN_Sender_and_receiver_not_in_same_subnetwork');
        });

        it('should report when ConnectedAP for server is missing', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="Subnet1" type="8-MMS">
                            <ConnectedAP iedName="ClientIED" apName="ClientAP"/>
                        </SubNetwork>
                    </Communication>
                    ${SERVER_IED}
                    ${CLIENT_IED}
                </SCL>`);
            const issues = ClientLN_Sender_and_receiver_not_in_same_subnetwork(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('ClientLN_Sender_and_receiver_not_in_same_subnetwork');
        });
    });
});
