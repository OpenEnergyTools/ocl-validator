import { ValidationIssue } from '../ValidationIssue';

// Rule: LDevice_one_LN0_required
export function lDevice_one_LN0_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('LDevice'))
        .filter((lDevice) => !lDevice.querySelector('LN0'))
        .map((lDevice) => ({
            severity: 'ERROR',
            id: 'LDevice_one_LN0_required',
            filename: docName,
            message: 'LDevice shall contain one LN0',
            element: lDevice,
        }));
}
