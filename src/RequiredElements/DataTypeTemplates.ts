import { ValidationIssue } from '../ValidationIssue';

// Rule: DataTypeTemplates_at_least_one_LNodeType_required
export function dataTypeTemplates_at_least_one_LNodeType_required(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates'))
        .filter((dataTypeTemplates) => dataTypeTemplates.querySelectorAll('LNodeType').length === 0)
        .map((dataTypeTemplates) => ({
            severity: 'ERROR',
            id: 'DataTypeTemplates_at_least_one_LNodeType_required',
            filename: docName,
            message: 'DataTypeTemplates shall contain at least one LNodeType',
            element: dataTypeTemplates,
        }));
}

// Rule: DataTypeTemplates_at_least_one_DOType_required
export function dataTypeTemplates_at_least_one_DOType_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates'))
        .filter((dataTypeTemplates) => dataTypeTemplates.querySelectorAll('DOType').length === 0)
        .map((dataTypeTemplates) => ({
            severity: 'ERROR',
            id: 'DataTypeTemplates_at_least_one_DOType_required',
            filename: docName,
            message: 'DataTypeTemplates shall contain at least one DOType',
            element: dataTypeTemplates,
        }));
}
