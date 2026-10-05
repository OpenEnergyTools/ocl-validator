import { ValidationIssue } from '../ValidationIssue';

// Rule: Certificate_one_Subject_required
export function certificate_one_Subject_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Authentication > Certificate'))
        .filter((certificate) => !certificate.querySelector(':scope > Subject'))
        .map((certificate) => ({
            severity: 'ERROR',
            id: 'Certificate_one_Subject_required',
            filename: docName,
            message: 'Certificate shall contain a Subject',
            element: certificate,
        }));
}

// Rule: Certificate_one_IssuerName_required
export function certificate_one_IssuerName_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Authentication > Certificate'))
        .filter((certificate) => !certificate.querySelector(':scope > IssuerName'))
        .map((certificate) => ({
            severity: 'ERROR',
            id: 'Certificate_one_IssuerName_required',
            filename: docName,
            message: 'Certificate shall contain an IssuerName',
            element: certificate,
        }));
}
