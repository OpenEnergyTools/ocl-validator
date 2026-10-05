import { describe, expect, it } from 'vitest';

import { address_at_least_one_P_required } from '../../src/RequiredElements/Address';

const DOC_NAME = 'test.scd';

/**
 * Helper function to create an XMLDocument from a string
 */
function parseXMLString(xmlString: string): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
}

describe('Address', () => {
    describe('address_at_least_one_P_required', () => {
        it('should return true when Address contains exactly one P element', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address">01-0C-CD-01-00-01</P>
                                </Address>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when Address contains multiple P elements', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address">01-0C-CD-01-00-01</P>
                                    <P name="IP">192.168.1.1</P>
                                    <P name="IP-Subnet">255.255.255.0</P>
                                </Address>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when Address contains no P elements', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = address_at_least_one_P_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Address_at_least_one_P_required',
                filename: DOC_NAME,
                message: 'Address shall contain at least one P',
            });
            expect(issues[0].element.tagName).toBe('Address');
        });

        it('should return false when one Address has no P elements', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address">01-0C-CD-01-00-01</P>
                                </Address>
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP1">
                                <Address/>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return true when multiple Address elements all have at least one P', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address">01-0C-CD-01-00-01</P>
                                </Address>
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP1">
                                <Address>
                                    <P name="IP">192.168.1.2</P>
                                    <P name="IP-Subnet">255.255.255.0</P>
                                </Address>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should handle Address with empty P element', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address"></P>
                                </Address>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should handle deeply nested Address elements', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SN1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <Address>
                                    <P name="MAC-Address">01-0C-CD-01-00-01</P>
                                </Address>
                            </ConnectedAP>
                            <SubNetwork name="SN2">
                                <ConnectedAP iedName="IED2" apName="AP1">
                                    <Address/>
                                </ConnectedAP>
                            </SubNetwork>
                        </SubNetwork>
                    </Communication>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(address_at_least_one_P_required(doc, DOC_NAME)).toHaveLength(1);
        });
    });
});
