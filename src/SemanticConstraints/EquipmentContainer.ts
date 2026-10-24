import { areNamesUnique } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > Substation',
    ':root > Process > Substation',
    ':root > Substation > VoltageLevel',
    ':root > Process > Substation > VoltageLevel',
    ':root > Substation > VoltageLevel > Bay',
    ':root > Process > Substation > VoltageLevel > Bay',
];

// Rule: EquipmentContainer_unique_PowerTransformer_name
export function EquipmentContainer_unique_PowerTransformer_name(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(', ')))
        .filter((ec) => !areNamesUnique(ec.querySelectorAll(':scope > PowerTransformer')))
        .map((ec) => ({
            severity: 'ERROR',
            id: 'EquipmentContainer_unique_PowerTransformer_name',
            filename: docName,
            message: 'PowerTransformer in EquipmentContainer shall have different name',
            element: ec,
        }));
}

// Rule: EquipmentContainer_unique_GeneralEquipment_name
export function EquipmentContainer_unique_GeneralEquipment_name(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(', ')))
        .filter((ec) => !areNamesUnique(ec.querySelectorAll(':scope > GeneralEquipment')))
        .map((ec) => ({
            severity: 'ERROR',
            id: 'EquipmentContainer_unique_GeneralEquipment_name',
            filename: docName,
            message: 'GeneralEquipment in EquipmentContainer shall have different name',
            element: ec,
        }));
}
