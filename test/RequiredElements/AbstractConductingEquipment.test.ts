import { describe, expect, it } from 'vitest';

import { abstractConductingEquipment_at_most_terminal } from '../../src/RequiredElements/AbstractConductingEquipment';

const DOC_NAME = 'test.scd';

/**
 * Helper function to create an XMLDocument from a string
 */
function parseXMLString(xmlString: string): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
}

describe('AbstractConductingEquipment', () => {
    describe('abstractConductingEquipment_at_most_terminal', () => {
        it('should return true when ConductingEquipment has at most 2 terminals', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1">
                                    <Terminal name="T1"/>
                                    <Terminal name="T2"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(abstractConductingEquipment_at_most_terminal(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when ConductingEquipment has 1 terminal', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1">
                                    <Terminal name="T1"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(abstractConductingEquipment_at_most_terminal(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when ConductingEquipment has 0 terminals', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1"/>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(abstractConductingEquipment_at_most_terminal(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when ConductingEquipment has more than 2 terminals', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1">
                                    <Terminal name="T1"/>
                                    <Terminal name="T2"/>
                                    <Terminal name="T3"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = abstractConductingEquipment_at_most_terminal(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AbstractConductingEquipment_at_most_terminal',
                filename: DOC_NAME,
                message: 'AbstractConductingEquipment shall contain at most 2 Terminal',
            });
            expect(issues[0].element.tagName).toBe('ConductingEquipment');
        });

        it('should return false when TransformerWinding has more than 2 terminals', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <PowerTransformer name="PT1">
                                    <TransformerWinding name="TW1">
                                        <Terminal name="T1"/>
                                        <Terminal name="T2"/>
                                        <Terminal name="T3"/>
                                        <Terminal name="T4"/>
                                    </TransformerWinding>
                                </PowerTransformer>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = abstractConductingEquipment_at_most_terminal(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.tagName).toBe('TransformerWinding');
        });

        it('should return true when multiple ConductingEquipments all have valid terminal counts', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1">
                                    <Terminal name="T1"/>
                                </ConductingEquipment>
                                <ConductingEquipment name="CE2">
                                    <Terminal name="T1"/>
                                    <Terminal name="T2"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(abstractConductingEquipment_at_most_terminal(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when one of multiple ConductingEquipments exceeds terminal limit', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <Substation>
                        <VoltageLevel>
                            <Bay>
                                <ConductingEquipment name="CE1">
                                    <Terminal name="T1"/>
                                    <Terminal name="T2"/>
                                </ConductingEquipment>
                                <ConductingEquipment name="CE2">
                                    <Terminal name="T1"/>
                                    <Terminal name="T2"/>
                                    <Terminal name="T3"/>
                                </ConductingEquipment>
                            </Bay>
                        </VoltageLevel>
                    </Substation>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = abstractConductingEquipment_at_most_terminal(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0].element.getAttribute('name')).toBe('CE2');
        });
    });
});
