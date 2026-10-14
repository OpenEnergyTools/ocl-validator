import { ValidationIssue } from '../ValidationIssue';

// Rule: AbstractDataObject_RefersToDOType
export function abstractDataObject_RefersToDOType(scl: XMLDocument, docName: string): ValidationIssue[] {
    // AbstractDataObject is the common base type of DO and SDO
    return Array.from(
        scl.querySelectorAll(':root DataTypeTemplates > LNodeType > DO, :root DataTypeTemplates > DOType > SDO')
    )
        .filter((dataObject) => {
            const type = dataObject.getAttribute('type');
            return type && !scl.querySelector(`DataTypeTemplates DOType[id="${type}"]`);
        })
        .map((dataObject) => {
            const name = dataObject.getAttribute('name') ?? '';
            return {
                severity: 'ERROR',
                id: 'AbstractDataObject_RefersToDOType',
                filename: docName,
                message: `DO or SDO (name=${name}) does not refer an existing DOType in DataTypeTemplates section`,
                element: dataObject,
            };
        });
}
