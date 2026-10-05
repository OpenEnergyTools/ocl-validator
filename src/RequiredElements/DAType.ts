import { ValidationIssue } from '../ValidationIssue';

// Rule: DAType_at_least_one_BDA_required
export function dAType_at_least_one_BDA_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('DAType'))
        .filter((daType) => daType.querySelectorAll('BDA').length === 0)
        .map((daType) => ({
            severity: 'ERROR',
            id: 'DAType_at_least_one_BDA_required',
            filename: docName,
            message: 'DAType shall contain at least one BDA',
            element: daType,
        }));
}
