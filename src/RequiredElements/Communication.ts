import { ValidationIssue } from '../ValidationIssue';

// Rule: Communication_at_least_one_SubNetwork_required
export function communication_at_least_one_SubNetwork_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Communication'))
        .filter((communication) => communication.querySelectorAll('SubNetwork').length === 0)
        .map((communication) => ({
            severity: 'ERROR',
            id: 'Communication_at_least_one_SubNetwork_required',
            filename: docName,
            message: 'Communication shall contain at least one SubNetwork',
            element: communication,
        }));
}
