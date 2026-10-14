import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: DA_unique_ProtNs_type_in_DA_from_DOType
export function DA_unique_ProtNs_type_in_DA_from_DOType(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates > DOType > DA'))
        .filter((da) => {
            const protNsElements = da.querySelectorAll('ProtNs');
            const types = Array.from(protNsElements).map((p) => p.getAttribute('type') || '');
            const uniqueTypes = new Set(types);
            return uniqueTypes.size !== types.length;
        })
        .map((da) => ({
            severity: 'ERROR',
            id: 'DA_unique_ProtNs_type_in_DA_from_DOType',
            filename: docName,
            message: 'Unique ProtNs type in DA from DOType',
            element: da,
        }));
}

// Rule: DA_DAType_allowedWhen_Enum
export function DA_DAType_allowedWhen_Enum(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates > DOType > DA'))
        .filter((da) => {
            const bType = getAttributeValue(da, 'bType');
            const type = getAttributeValue(da, 'type');
            return bType !== 'Struct' && bType !== 'Enum' && type !== '';
        })
        .map((da) => ({
            severity: 'ERROR',
            id: 'DA_DAType_allowedWhen_Enum',
            filename: docName,
            message: 'DA.type is allowed only if bType = Struct or Enum',
            element: da,
        }));
}

// Rule: DA_RefersToDATypeorEnumType
export function DA_RefersToDATypeorEnumType(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector('DataTypeTemplates');
    return Array.from(scl.querySelectorAll('DA'))
        .filter((da) => {
            const bType = getAttributeValue(da, 'bType');

            if (bType === 'Struct') {
                const refersToDAType = getAttributeValue(da, 'type');
                return refersToDAType && !dataTypeTemplates?.querySelector(`:scope > DAType[id="${refersToDAType}"]`);
            } else if (bType === 'Enum') {
                const refersToEnumType = getAttributeValue(da, 'type');
                return (
                    refersToEnumType && !dataTypeTemplates?.querySelector(`:scope > EnumType[id="${refersToEnumType}"]`)
                );
            }
            return false;
        })
        .map((da) => {
            const name = getAttributeValue(da, 'name');
            return {
                severity: 'ERROR',
                id: 'DA_RefersToDATypeorEnumType',
                filename: docName,
                message: `DA (name=${name}) does not refer an existing DAType or EnumType in DataTypeTemplates section`,
                element: da,
            };
        });
}

// Rule: DA_Struct_no_valKind_or_valImport
export function DA_Struct_no_valKind_or_valImport(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('DA'))
        .filter((da) => {
            const bType = getAttributeValue(da, 'bType');
            const valImport = getAttributeValue(da, 'valImport');
            const valKind = getAttributeValue(da, 'valKind');
            return bType === 'Struct' && ((valImport && valImport !== 'false') || (valKind && valKind !== 'Set'));
        })
        .map((da) => ({
            severity: 'WARNING',
            id: 'DA_Struct_no_valKind_or_valImport',
            filename: docName,
            message: 'The attributes valKind and valImport make no sense for DA elements with bType = Struct',
            element: da,
        }));
}
