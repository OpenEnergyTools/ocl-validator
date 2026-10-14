import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: BDA_BDAType_allowedWhen_Enum
export function BDA_BDAType_allowedWhen_Enum(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('BDA'))
        .filter((bda) => {
            const bType = getAttributeValue(bda, 'bType');
            const type = getAttributeValue(bda, 'type');
            return bType !== 'Struct' && bType !== 'Enum' && type !== '';
        })
        .map((bda) => ({
            severity: 'ERROR',
            id: 'BDA_BDAType_allowedWhen_Enum',
            filename: docName,
            message: 'BDA.type is allowed only if bType = Struct or Enum',
            element: bda,
        }));
}

// Rule: BDA_RefersToDATypeorEnumType
export function BDA_RefersToDATypeorEnumType(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');
    return Array.from(scl.querySelectorAll(':root > DataTypeTemplates > DAType > BDA'))
        .filter((bda) => {
            const bType = getAttributeValue(bda, 'bType');

            if (bType === 'Struct') {
                const refersToDAType = getAttributeValue(bda, 'type');
                return refersToDAType && !dataTypeTemplates?.querySelector(`:scope > DAType[id="${refersToDAType}"]`);
            } else if (bType === 'Enum') {
                const refersToEnumType = getAttributeValue(bda, 'type');
                return refersToEnumType && !dataTypeTemplates?.querySelector(`:scope > EnumType[id="${refersToEnumType}"]`);
            }
            return false;
        })
        .map((bda) => {
            const name = getAttributeValue(bda, 'name');
            return {
                severity: 'ERROR',
                id: 'BDA_RefersToDATypeorEnumType',
                filename: docName,
                message: `BDA (name=${name}) does not refer an existing DAType or EnumType in DataTypeTemplates section`,
                element: bda,
            };
        });
}
