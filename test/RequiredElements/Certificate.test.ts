import { describe, expect, it } from 'vitest';

import {
    certificate_one_Subject_required,
    certificate_one_IssuerName_required
} from '../../src/RequiredElements/Certificate';

const DOC_NAME = 'test.scd';

function parseXMLString(xmlString: string): XMLDocument {
    return new DOMParser().parseFromString(xmlString, 'text/xml');
}

function certificateXml(inner: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <SCL xmlns="http://www.iec.ch/61850/2003/SCL">
            <IED name="IED1">
                <AccessPoint name="AP1">
                    <Server>
                        <Authentication>
                            ${inner}
                        </Authentication>
                    </Server>
                </AccessPoint>
            </IED>
        </SCL>`;
}

describe('Certificate', () => {
    describe('certificate_one_Subject_required', () => {
        it('should return no issues when Certificate has a Subject', () => {
            const doc = parseXMLString(certificateXml(
                '<Certificate><Subject/></Certificate>'
            ));
            expect(certificate_one_Subject_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Certificate has no Subject', () => {
            const doc = parseXMLString(certificateXml('<Certificate/>'));
            const issues = certificate_one_Subject_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Certificate_one_Subject_required',
                filename: DOC_NAME,
                message: 'Certificate shall contain a Subject',
            });
            expect(issues[0].element.tagName).toBe('Certificate');
        });

        it('should return no issues when there is no Certificate', () => {
            const doc = parseXMLString(certificateXml(''));
            expect(certificate_one_Subject_required(doc, DOC_NAME)).toEqual([]);
        });
    });

    describe('Certificate_one_IssuerName_required', () => {
        it('should return no issues when Certificate has an IssuerName', () => {
            const doc = parseXMLString(certificateXml(
                '<Certificate><IssuerName/></Certificate>'
            ));
            expect(certificate_one_IssuerName_required(doc, DOC_NAME)).toEqual([]);
        });

        it('should return an issue when Certificate has no IssuerName', () => {
            const doc = parseXMLString(certificateXml('<Certificate/>'));
            const issues = certificate_one_IssuerName_required(doc, DOC_NAME);
            expect(issues).toHaveLength(1);
            expect(issues[0]).toMatchObject({
                severity: 'ERROR',
                id: 'Certificate_one_IssuerName_required',
                filename: DOC_NAME,
                message: 'Certificate shall contain an IssuerName',
            });
            expect(issues[0].element.tagName).toBe('Certificate');
        });

        it('should return one issue per faulty Certificate', () => {
            const doc = parseXMLString(certificateXml(
                '<Certificate/><Certificate/>'
            ));
            expect(certificate_one_IssuerName_required(doc, DOC_NAME)).toHaveLength(2);
        });
    });
});
