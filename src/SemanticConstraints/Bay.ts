import { areNamesUnique, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [':root > Substation > VoltageLevel > Bay', ':root > Process > Substation > VoltageLevel > Bay'];

// Rule: Bay_unique_ConductingEquipment_name
export function Bay_unique_ConductingEquipment_name(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((bay) => !areNamesUnique(bay.querySelectorAll(':scope > ConductingEquipment')))
        .map((bay) => ({
            severity: 'ERROR',
            id: 'Bay_unique_ConductingEquipment_name',
            filename: docName,
            message: 'ConductingEquipment in Bay shall have different name',
            element: bay,
        }));
}

// Rule: Bay_unique_DirectChild_name
export function Bay_unique_DirectChild_name(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((bay) => {
            const functions = bay.querySelectorAll(':scope > Function');
            const generalEquipments = bay.querySelectorAll(':scope > GeneralEquipment');
            const powerTransformers = bay.querySelectorAll(':scope > PowerTransformer');
            const conductingEquipments = bay.querySelectorAll(':scope > ConductingEquipment');
            const connectivityNodes = bay.querySelectorAll(':scope > ConnectivityNode');

            const allNamedElements = [
                ...Array.from(functions),
                ...Array.from(generalEquipments),
                ...Array.from(powerTransformers),
                ...Array.from(conductingEquipments),
                ...Array.from(connectivityNodes),
            ];

            const names = allNamedElements.map((el) => getAttributeValue(el, 'name'));
            const nonEmptyNames = names.filter((name) => name !== '');
            const uniqueNames = new Set(nonEmptyNames);
            return uniqueNames.size !== nonEmptyNames.length;
        })
        .map((bay) => ({
            severity: 'ERROR',
            id: 'Bay_unique_DirectChild_name',
            filename: docName,
            message: 'All direct childs in Bay shall have different name',
            element: bay,
        }));
}
