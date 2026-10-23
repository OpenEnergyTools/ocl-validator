import { ValidationIssue } from '../ValidationIssue';

//Role: PhysConn_P_type_unique
export function physConn_P_type_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP > PhysConn'))
        .filter((physConn) => {
            const pElements = physConn.querySelectorAll(':scope > P');
            const types = Array.from(pElements).map((p) => p.getAttribute('type') || '');
            const uniqueTypes = new Set(types);
            return uniqueTypes.size !== types.length;
        })
        .map((physConn) => ({
            severity: 'ERROR',
            id: 'PhysConn_P_type_unique',
            filename: docName,
            message: 'The P parameter type values shall be unique within each PhysConn element',
            element: physConn,
        }));
}
