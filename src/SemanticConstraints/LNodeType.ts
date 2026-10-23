import { areNamesUnique } from '../Helpers';
import { ValidationIssue } from '../ValidationIssue';

//Role: LNodeType_unique_DO_name_from_DataTypeTemplates
export function lNodeType_unique_DO_name_from_DataTypeTemplates(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates > LNodeType'))
        .filter((lNodeType) => {
            return !areNamesUnique(lNodeType.querySelectorAll(':scope > DO'));
        })
        .map((lNodeType) => ({
            severity: 'ERROR',
            id: 'LNodeType_unique_DO_name_from_DataTypeTemplates',
            filename: docName,
            message: 'Unique DO name in LNodeTYpe from DataTypeTemplates',
            element: lNodeType,
        }));
}
