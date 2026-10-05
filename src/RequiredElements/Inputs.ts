import { ValidationIssue } from '../ValidationIssue';

// Rule: Inputs_at_least_one_ExtRef_required
export function inputs_at_least_one_ExtRef_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('Inputs'))
        .filter((inputs) => inputs.querySelectorAll('ExtRef').length === 0)
        .map((inputs) => ({
            severity: 'ERROR',
            id: 'Inputs_at_least_one_ExtRef_required',
            filename: docName,
            message: 'Inputs shall contain at least one ExtRef',
            element: inputs,
        }));
}
