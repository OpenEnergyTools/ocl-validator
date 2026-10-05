import { ValidationIssue } from '../ValidationIssue';

// Rule: EnumType_at_least_one_EnumVal_required
export function enumType_at_least_one_EnumVal_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('EnumType'))
        .filter((enumType) => enumType.querySelectorAll('EnumVal').length === 0)
        .map((enumType) => ({
            severity: 'ERROR',
            id: 'EnumType_at_least_one_EnumVal_required',
            filename: docName,
            message: 'EnumType shall contain at least one EnumVal',
            element: enumType,
        }));
}
