import { findReferencedServerLN, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: Association_RefersToAnyLN
export function Association_RefersToAnyLN(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > Association'))
        .filter((association) => {
            const associationID = getAttributeValue(association, 'associationID');
            return associationID && !findReferencedServerLN(scl, association);
        })
        .map((association) => {
            const associationID = getAttributeValue(association, 'associationID');
            return {
                severity: 'ERROR',
                id: 'Association_RefersToAnyLN',
                filename: docName,
                message: `Association (ID=${associationID}) does not refer an existing LN`,
                element: association,
            };
        });
}
