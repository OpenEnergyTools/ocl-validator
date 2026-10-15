import { areNamesUnique, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates
export function DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');
    if (!dataTypeTemplates) return [];

    return Array.from(dataTypeTemplates.querySelectorAll(':scope > DAType'))
        .filter((daType) => !areNamesUnique(daType.querySelectorAll(':scope > BDA')))
        .map((daType) => ({
            severity: 'ERROR',
            id: 'DAType_unique_BDA_name_in_DAType_from_DataTypeTemplates',
            filename: docName,
            message: 'Unique BDA name in DAType from DataTypeTemplates',
            element: daType,
        }));
}

// Rule: DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates
export function DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');
    if (!dataTypeTemplates) return [];

    return Array.from(dataTypeTemplates.querySelectorAll(':scope > DAType'))
        .filter((daType) => {
            const protNss = daType.querySelectorAll(':scope > ProtNs');
            const types = Array.from(protNss).map((protNs) => getAttributeValue(protNs, 'type'));
            const nonEmptyTypes = types.filter((type) => type !== '');
            const uniqueTypes = new Set(nonEmptyTypes);
            return uniqueTypes.size !== nonEmptyTypes.length;
        })
        .map((daType) => ({
            severity: 'ERROR',
            id: 'DAType_unique_ProtNs_type_in_DAType_from_DataTypeTemplates',
            filename: docName,
            message: 'Unique ProtNs type in DAType from DataTypeTemplates',
            element: daType,
        }));
}
