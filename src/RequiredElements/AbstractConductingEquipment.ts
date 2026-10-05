import { ValidationIssue } from '../ValidationIssue';

// Rule: AbstractConductingEquipment_at_most_terminal
export function abstractConductingEquipment_at_most_terminal(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('ConductingEquipment, TransformerWinding'))
        .filter((element) => {
            const terminals = element.querySelectorAll('Terminal');
            return terminals.length > 2;
        })
        .map((element) => ({
            severity: 'ERROR',
            id: 'AbstractConductingEquipment_at_most_terminal',
            filename: docName,
            message: 'AbstractConductingEquipment shall contain at most 2 Terminal',
            element,
        }));
}
