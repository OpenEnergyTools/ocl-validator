import { ValidationIssue } from '../ValidationIssue';

// Rule: Substation_at_least_one_VoltageLevel_required
export function substation_at_least_one_VoltageLevel_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Substation'))
        .filter((substation) => substation.querySelectorAll('VoltageLevel').length === 0)
        .map((substation) => ({
            severity: 'ERROR',
            id: 'Substation_at_least_one_VoltageLevel_required',
            filename: docName,
            message: 'Substation shall contain at least one VoltageLevel',
            element: substation,
        }));
}
