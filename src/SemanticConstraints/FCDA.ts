import { findReferencedDataType, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > FCDA',
    ':root > IED > AccessPoint > Server > LDevice > LN > FCDA',
];

// Rule: FCDA_RefersToAbstractDataAttribute
export function FCDA_RefersToAbstractDataAttribute(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((fcda) => {
            return !findReferencedDataType(scl, fcda);
        })
        .map((fcda) => ({
            severity: 'ERROR',
            id: 'FCDA_RefersToAbstractDataAttribute',
            filename: docName,
            message: 'FCDA does not refer any existing DA or BDA in DataTypeTemplates section',
            element: fcda,
        }));
}
