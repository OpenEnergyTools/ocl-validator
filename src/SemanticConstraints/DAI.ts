import { findReferencedDA, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: DAI_RefersToAbstractDataAttribute
export function DAI_RefersToAbstractDataAttribute(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('DAI'))
        .filter((dai) => {
            const name = getAttributeValue(dai, 'name');
            return name && !findReferencedDA(scl, dai);
        })
        .map((dai) => ({
            severity: 'ERROR',
            id: 'DAI_RefersToAbstractDataAttribute',
            filename: docName,
            message: `DAI (name=${getAttributeValue(dai, 'name')}) does not refer an existing DA in DataTypeTemplates section`,
            element: dai,
        }));
}
