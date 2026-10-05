import { ValidationIssue } from '../ValidationIssue';

// Rule: LNodeType_at_least_one_DO_required
export function lNodeType_at_least_one_DO_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('LNodeType'))
        .filter((lNodeType) => lNodeType.querySelectorAll('DO').length === 0)
        .map((lNodeType) => ({
            severity: 'ERROR',
            id: 'LNodeType_at_least_one_DO_required',
            filename: docName,
            message: 'LNodeType shall contain at least one DO',
            element: lNodeType,
        }));
}
