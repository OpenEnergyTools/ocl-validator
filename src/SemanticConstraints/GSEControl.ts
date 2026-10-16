import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: GSEControl_datSet_valid_reference
export function GSEControl_datSet_valid_reference(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > LDevice > LN0 > GSEControl'))
        .filter((gseControl) => {
            const datSet = getAttributeValue(gseControl, 'datSet');
            if (!datSet) return false;

            return !gseControl.parentElement?.querySelector(`:scope > DataSet[name="${datSet}"]`);
        })
        .map((gseControl) => ({
            severity: 'ERROR',
            id: 'GSEControl_datSet_valid_reference',
            filename: docName,
            message: 'datSet attribute shall reference a valid DataSet in LLN0 in GSEControl',
            element: gseControl,
        }));
}
