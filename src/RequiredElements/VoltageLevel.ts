import { ValidationIssue } from '../ValidationIssue';

// Rule: VoltageLevel_at_least_one_Bay_required
export function voltageLevel_at_least_one_Bay_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Substation > VoltageLevel'))
        .filter((voltageLevel) => voltageLevel.querySelectorAll(':scope > Bay').length === 0)
        .map((voltageLevel) => ({
            severity: 'ERROR',
            id: 'VoltageLevel_at_least_one_Bay_required',
            filename: docName,
            message: 'VoltageLevel shall contain at least one Bay',
            element: voltageLevel,
        }));
}
