import { findMissingDAorBDAorEnumVal, findMissingDOorSDO, findReferencedServerAnyLN } from '../Helpers';
import { ValidationIssue } from '../ValidationIssue';

const selector = ':root > Substation LNode, :root > Line LNode, :root > Process LNode';

//Role: iedName_consistency
export function lNode_iedName_consistency(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const iedName = lNode.getAttribute('iedName');
            if (iedName === 'None')
                return false; // during specification, 'None' indicates no IED reference
            else return !findReferencedServerAnyLN(scl, lNode);
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'iedName_consistency',
            filename: docName,
            message: 'iedName in LNode shall be the name of the IED that contains the referenced LN',
            element: lNode,
        }));
}

//Role: ldInst_consistency
export function LNode_ldInst_consistency(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const iedName = lNode.getAttribute('iedName');
            if (iedName === 'None')
                return false; // during specification, 'None' indicates no IED reference
            else return !findReferencedServerAnyLN(scl, lNode);
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'ldInst_consistency',
            filename: docName,
            message: 'ldInst in LNode shall be the inst of the LDevice that contains the referenced LN',
            element: lNode,
        }));
}

//Role: lnClass_consistency
export function LNode_lnClass_consistency(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const iedName = lNode.getAttribute('iedName');
            if (iedName === 'None')
                return false; // during specification, 'None' indicates no IED reference
            else return !findReferencedServerAnyLN(scl, lNode);
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'lnClass_consistency',
            filename: docName,
            message: 'lnClass in LNode shall be the class of the referenced LN',
            element: lNode,
        }));
}

//Role: prefix_consistency
export function LNode_prefix_consistency(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const iedName = lNode.getAttribute('iedName');
            if (iedName === 'None')
                return false; // during specification, 'None' indicates no IED reference
            else return !findReferencedServerAnyLN(scl, lNode);
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'prefix_consistency',
            filename: docName,
            message: 'prefix in LNode shall be the prefix of the referenced LN',
            element: lNode,
        }));
}

//Role: lnInst_consistency
export function LNode_lnInst_consistency(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const iedName = lNode.getAttribute('iedName');
            if (iedName === 'None')
                return false; // during specification, 'None' indicates no IED reference
            else return !findReferencedServerAnyLN(scl, lNode);
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'lnInst_consistency',
            filename: docName,
            message: 'lnInst in LNode shall be the inst of the referenced LN',
            element: lNode,
        }));
}

//Role: LNode_lnType_consistencyDO
export function LNode_lnType_consistencyDO(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dtt = scl.querySelector(':root > DataTypeTemplates')!;
    if (!dtt) return [];

    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const oursLNodeType = dtt.querySelector(`:scope > LNodeType[id="${lNode.getAttribute('lnType')}"]`);
            const anyLn = findReferencedServerAnyLN(scl, lNode);
            const theirsLNodeType = dtt.querySelector(`:scope > LNodeType[id="${anyLn?.getAttribute('lnType')}"]`);

            if (!oursLNodeType) return false;
            if (!theirsLNodeType) {
                if (anyLn) return true;
                return false;
            }

            return findMissingDOorSDO(scl, oursLNodeType, theirsLNodeType).length > 0;
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'LNode_lnType_consistencyDO',
            filename: docName,
            message: `lnType in LNode specifies something different from what is implemented in the IED : missing DO or SDO`,
            element: lNode,
        }));
}

//Role: LNode_lnType_consistencyDA
export function LNode_lnType_consistencyDA(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dtt = scl.querySelector(':root > DataTypeTemplates')!;
    if (!dtt) return [];

    return Array.from(scl.querySelectorAll(selector))
        .filter((lNode) => {
            const oursLNodeType = dtt.querySelector(`:scope > LNodeType[id="${lNode.getAttribute('lnType')}"]`);
            const anyLn = findReferencedServerAnyLN(scl, lNode);
            const theirsLNodeType = dtt.querySelector(`:scope > LNodeType[id="${anyLn?.getAttribute('lnType')}"]`);

            if (!oursLNodeType) return false;
            if (!theirsLNodeType) {
                if (anyLn) return true;
                return false;
            }

            return findMissingDAorBDAorEnumVal(scl, oursLNodeType, theirsLNodeType).length > 0;
        })
        .map((lNode) => ({
            severity: 'ERROR',
            id: 'LNode_lnType_consistencyDA',
            filename: docName,
            message:
                'lnType in LNode specifies something different from what is implemented in the IED : different parameters',
            element: lNode,
        }));
}
