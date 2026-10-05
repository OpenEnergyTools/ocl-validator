import { ValidationIssue } from '../ValidationIssue';

// Rule: IED_at_least_one_AccessPoint_required
export function ied_at_least_one_AccessPoint_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED'))
        .filter((ied) => ied.querySelectorAll(':scope > AccessPoint').length === 0)
        .map((ied) => ({
            severity: 'ERROR',
            id: 'IED_at_least_one_AccessPoint_required',
            filename: docName,
            message: 'IED shall contain at least one AccessPoint',
            element: ied,
        }));
}
