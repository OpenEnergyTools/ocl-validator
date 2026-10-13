import { describe, expect, it } from 'vitest';

import {
    ConnectedAP_ied_exists,
    ConnectedAP_RefersToAccessPoint,
    ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork,
    ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork
} from '../../src/SemanticConstraints/ConnectedAP';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function scl(communication: string, ieds: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <Communication>${communication}</Communication>
            ${ieds}
        </SCL>`;
}

const IED1 = `<IED name="IED1">
    <AccessPoint name="AP1"><Server/></AccessPoint>
</IED>`;

describe('ConnectedAP', () => {
    describe('ConnectedAP_ied_exists', () => {
        it('should return no issues when iedName refers to an existing IED', () => {
            const doc = parseXMLString(scl(
                '<SubNetwork name="SN1" type="8-MMS"><ConnectedAP iedName="IED1" apName="AP1"/></SubNetwork>',
                IED1
            ));
            expect(ConnectedAP_ied_exists(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a ConnectedAP referring to a missing IED', () => {
            const doc = parseXMLString(scl(
                '<SubNetwork name="SN1" type="8-MMS"><ConnectedAP iedName="MISSING" apName="AP1"/></SubNetwork>',
                IED1
            ));
            const issues = ConnectedAP_ied_exists(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_ied_exists',
                filename: DOC_NAME,
                message: 'iedName attribute shall refer to an existing IED in ConnectedAP. Current value is MISSING',
            });
            expect(issues[0].element.tagName).toBe('ConnectedAP');
        });

        it('should return no issues when there are no ConnectedAP elements', () => {
            const doc = parseXMLString(scl('', IED1));
            expect(ConnectedAP_ied_exists(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork', () => {
        it('should return no issues when GSE cbName/ldInst combinations are unique', () => {
            const doc = parseXMLString(scl(
                `<SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <GSE ldInst="LD1" cbName="GCB1"/>
                        <GSE ldInst="LD1" cbName="GCB2"/>
                    </ConnectedAP>
                </SubNetwork>`,
                IED1
            ));
            expect(ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when only ldInst differs', () => {
            const doc = parseXMLString(scl(
                `<SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <GSE ldInst="LD1" cbName="GCB1"/>
                        <GSE ldInst="LD2" cbName="GCB1"/>
                    </ConnectedAP>
                </SubNetwork>`,
                IED1
            ));
            expect(ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate GSE cbName/ldInst combinations', () => {
            const doc = parseXMLString(scl(
                `<SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <GSE ldInst="LD1" cbName="GCB1"/>
                        <GSE ldInst="LD1" cbName="GCB1"/>
                    </ConnectedAP>
                </SubNetwork>`,
                IED1
            ));
            const issues = ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork',
                filename: DOC_NAME,
                message: 'Unique GSE cbName and ldInst combination in ConnectedAP from SubNetwork',
            });
            expect(issues[0].element.tagName).toBe('ConnectedAP');
        });
    });

    describe('ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork', () => {
        it('should return no issues when SMV cbName/ldInst combinations are unique', () => {
            const doc = parseXMLString(scl(
                `<SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <SMV ldInst="LD1" cbName="SCB1"/>
                        <SMV ldInst="LD2" cbName="SCB1"/>
                    </ConnectedAP>
                </SubNetwork>`,
                IED1
            ));
            expect(ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork(doc, DOC_NAME)).toEqual([]);
        });

        it('should report duplicate SMV cbName/ldInst combinations', () => {
            const doc = parseXMLString(scl(
                `<SubNetwork name="SN1" type="8-MMS">
                    <ConnectedAP iedName="IED1" apName="AP1">
                        <SMV ldInst="LD1" cbName="SCB1"/>
                        <SMV ldInst="LD1" cbName="SCB1"/>
                    </ConnectedAP>
                </SubNetwork>`,
                IED1
            ));
            const issues = ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork',
                filename: DOC_NAME,
                message: 'Unique SMV cbName and ldInst combination in ConnectedAP from SubNetwork',
            });
            expect(issues[0].element.tagName).toBe('ConnectedAP');
        });
    });

    describe('ConnectedAP_RefersToAccessPoint', () => {
        it('should return no issues when apName refers to an existing AccessPoint', () => {
            const doc = parseXMLString(scl(
                '<SubNetwork name="SN1" type="8-MMS"><ConnectedAP iedName="IED1" apName="AP1"/></SubNetwork>',
                IED1
            ));
            expect(ConnectedAP_RefersToAccessPoint(doc, DOC_NAME)).toEqual([]);
        });

        it('should report a ConnectedAP referring to a missing AccessPoint', () => {
            const doc = parseXMLString(scl(
                '<SubNetwork name="SN1" type="8-MMS"><ConnectedAP iedName="IED1" apName="MISSING"/></SubNetwork>',
                IED1
            ));
            const issues = ConnectedAP_RefersToAccessPoint(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'ConnectedAP_RefersToAccessPoint',
                filename: DOC_NAME,
                message: 'ConnectedAP (apName=MISSING) does not refer an existing AccessPoint in IED section',
            });
            expect(issues[0].element.tagName).toBe('ConnectedAP');
        });
    });
});
