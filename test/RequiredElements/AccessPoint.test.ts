import { describe, expect, it } from 'vitest';

import {
    accessPoint_restriction_on_content,
    accessPoint_at_most_securities,
    accessPoint_securities_allowed
} from '../../src/RequiredElements/AccessPoint';

const DOC_NAME = 'test.scd';

/**
 * Helper function to create an XMLDocument from a string
 */
function parseXMLString(xmlString: string): XMLDocument {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
}

describe('AccessPoint', () => {
    describe('accessPoint_restriction_on_content', () => {
        it('should return true when AccessPoint contains Server only', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when AccessPoint contains ServerAt only', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <ServerAt/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when AccessPoint contains LN only', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <LN lnClass="LLN0" inst="" lnType="someType"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when AccessPoint contains none of Server, ServerAt, or LN', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1"/>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when AccessPoint contains both Server and ServerAt', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                            <ServerAt/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = accessPoint_restriction_on_content(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AccessPoint_restriction_on_content',
                filename: DOC_NAME,
                message: 'AccessPoint shall contain one Server xor one ServerAt xor at least one LN xor none of them',
            });
            expect(issues[0].element.tagName).toBe('AccessPoint');
        });

        it('should return false when AccessPoint contains both Server and LN', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                            <LN name="LN1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return false when AccessPoint contains ServerAt and LN', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <ServerAt/>
                            <LN name="LN1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return true when AccessPoint contains multiple LN elements', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <LN name="LN1"/>
                            <LN name="LN2"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_restriction_on_content(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('accessPoint_at_most_securities', () => {
        it('should return true when no securities are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_at_most_securities(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when exactly 7 GOOSESecurity elements are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            ${Array.from({ length: 7 }, (_, i) => `<GOOSESecurity key="key${i}"/>`).join('')}
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_at_most_securities(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when more than 7 GOOSESecurity elements are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            ${Array.from({ length: 8 }, (_, i) => `<GOOSESecurity key="key${i}"/>`).join('')}
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = accessPoint_at_most_securities(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AccessPoint_at_most_securities',
                filename: DOC_NAME,
                message: 'AccessPoint shall contain at most 7 GOOSESecurity and at most 7 SMVSecurity',
            });
        });

        it('should return true when exactly 7 SMVSecurity elements are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            ${Array.from({ length: 7 }, (_, i) => `<SMVSecurity key="key${i}"/>`).join('')}
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_at_most_securities(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when more than 7 SMVSecurity elements are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            ${Array.from({ length: 8 }, (_, i) => `<SMVSecurity key="key${i}"/>`).join('')}
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_at_most_securities(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return true when combined GOOSESecurity and SMVSecurity are within limits', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            ${Array.from({ length: 4 }, (_, i) => `<GOOSESecurity key="key${i}"/>`).join('')}
                            ${Array.from({ length: 3 }, (_, i) => `<SMVSecurity key="key${i}"/>`).join('')}
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_at_most_securities(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('accessPoint_securities_allowed', () => {
        it('should return true when no securities are present', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_securities_allowed(doc, DOC_NAME)).toEqual([]);
        });

        it('should return true when securities are present with Server having Authentication.certificate=true', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <Authentication certificate="true"/>
                            </Server>
                            <GOOSESecurity key="key1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_securities_allowed(doc, DOC_NAME)).toEqual([]);
        });

        it('should return false when securities are present but Server is missing', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <GOOSESecurity key="key1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            const issues = accessPoint_securities_allowed(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'AccessPoint_securities_allowed',
                filename: DOC_NAME,
            });
            expect(issues[0].element.tagName).toBe('AccessPoint');
        });

        it('should return false when securities are present but Authentication is missing', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server/>
                            <GOOSESecurity key="key1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_securities_allowed(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return false when securities are present but certificate is not true', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <Authentication certificate="false"/>
                            </Server>
                            <GOOSESecurity key="key1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_securities_allowed(doc, DOC_NAME)).toHaveLength(1);
        });

        it('should return true when SMVSecurity is present with valid authentication', () => {
            const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
                <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
                    <IED name="IED1">
                        <AccessPoint name="AP1">
                            <Server>
                                <Authentication certificate="true"/>
                            </Server>
                            <SMVSecurity key="key1"/>
                        </AccessPoint>
                    </IED>
                </SCL>`;
            const doc = parseXMLString(xmlString);
            expect(accessPoint_securities_allowed(doc, DOC_NAME)).toEqual([]);
        });
    });
});
