import { ValidationIssue } from '../ValidationIssue';

/**
 * The SubEquipment in AbstractConductingEquipment shall have unique child name (from SCL_Substation.xsd)
 * ConductingEquipment and TransformerWinding are concrete implementations of AbstractConductingEquipment
 * Rule: AbstractConductingEquipment_unique_name_of_SubEquipment
 */
export function AbstractConductingEquipment_unique_name_of_SubEquipment(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root ConductingEquipment, :root TransformerWinding'))
        .filter((ace) => {
            const names = Array.from(ace.querySelectorAll(':scope > SubEquipment')).map(
                (se) => se.getAttribute('name') || ''
            );
            return new Set(names).size !== names.length;
        })
        .map((ace): ValidationIssue => ({
            severity: 'ERROR',
            id: 'AbstractConductingEquipment_unique_name_of_SubEquipment',
            filename: docName,
            message: 'Unique child name of SubEquipment in AbstractConductingEquipment',
            element: ace,
        }));
}
