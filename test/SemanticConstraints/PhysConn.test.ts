import { describe, expect, it } from 'vitest';

import { physConn_P_type_unique } from '../../src/SemanticConstraints/PhysConn';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

describe('PhysConn', () => {
    describe('physConn_P_type_unique', () => {
        it('should return no issues when PhysConn has P elements with unique type attributes', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP-SUBNET"/>
                                    <P type="IP-GATEWAY"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(physConn_P_type_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PhysConn has a single P element', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(physConn_P_type_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when PhysConn has no P elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn></PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(physConn_P_type_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should return no issues when multiple PhysConn elements all have unique P types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP-SUBNET"/>
                                </PhysConn>
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP-GATEWAY"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(physConn_P_type_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue when PhysConn has P elements with duplicate empty type attributes', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P/>
                                    <P type=""/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'PhysConn_P_type_unique',
                filename: DOC_NAME,
                message: 'The P parameter type values shall be unique within each PhysConn element',
            });
            expect(issues[0].element?.tagName).toBe('PhysConn');
        });

        it('should report issue when PhysConn has P elements with duplicate type attributes', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'PhysConn_P_type_unique',
                filename: DOC_NAME,
                message: 'The P parameter type values shall be unique within each PhysConn element',
            });
            expect(issues[0].element?.tagName).toBe('PhysConn');
        });

        it('should report issue when PhysConn has multiple P elements with the same type', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP-SUBNET"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('PhysConn_P_type_unique');
        });

        it('should report issue when PhysConn has P elements with duplicate empty type attributes', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type=""/>
                                    <P type=""/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('PhysConn_P_type_unique');
        });

        it('should report issues for each PhysConn with duplicate P types in different ConnectedAPs', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                            <ConnectedAP iedName="IED2" apName="AP1">
                                <PhysConn>
                                    <P type="VLAN"/>
                                    <P type="VLAN"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(2);
            expect(issues.every(issue => issue.id === 'PhysConn_P_type_unique')).toBe(true);
        });

        it('should report issue when PhysConn has three P elements with duplicate types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('PhysConn_P_type_unique');
        });

        it('should handle PhysConn with mixed valid and invalid P types', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP-SUBNET"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
        });

        it('should handle multiple SubNetworks with PhysConn elements', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="IP"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                        <SubNetwork name="SubNet2">
                            <ConnectedAP iedName="IED2" apName="AP1">
                                <PhysConn>
                                    <P type="VLAN"/>
                                    <P type="VLAN-PRIORITY"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element?.closest('SubNetwork')?.getAttribute('name')).toBe('SubNet1');
        });

        it('should return no issues when P types are case-sensitive and different', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP"/>
                                    <P type="ip"/>
                                    <P type="Ip"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            expect(physConn_P_type_unique(doc, DOC_NAME)).toEqual([]);
        });

        it('should report issue for PhysConn with duplicate P types regardless of order', () => {
            const doc = parseXMLString(`<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Communication>
                        <SubNetwork name="SubNet1">
                            <ConnectedAP iedName="IED1" apName="AP1">
                                <PhysConn>
                                    <P type="IP-SUBNET"/>
                                    <P type="IP"/>
                                    <P type="IP-SUBNET"/>
                                </PhysConn>
                            </ConnectedAP>
                        </SubNetwork>
                    </Communication>
                </SCL>`);
            const issues = physConn_P_type_unique(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].id).toBe('PhysConn_P_type_unique');
        });
    });
});
