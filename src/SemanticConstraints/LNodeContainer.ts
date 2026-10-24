import { ValidationIssue } from '../ValidationIssue';

const selector = ':root > Substation LNode, :root > Line LNode, :root > Process LNode';

// Rule: LNodeContainer_unique_LNode_combination
export function lNodeContainer_unique_LNode_combination(scl: XMLDocument, docName: string): ValidationIssue[] {
    const parents = Array.from(scl.querySelectorAll(selector))
        .map((lNode) => lNode.parentElement)
        .filter((parent) => parent !== null);

    return Array.from(new Set(parents))
        .filter((lNodeContainer) => {
            const lNodes = lNodeContainer.querySelectorAll(':scope > LNode');
            const combinationKeys = Array.from(lNodes).map((ln) => {
                const lnInst = ln.getAttribute('lnInst') || '';
                const lnClass = ln.getAttribute('lnClass');
                const iedName = ln.getAttribute('iedName');
                const ldInst = ln.getAttribute('ldInst') || '';
                const prefix = ln.getAttribute('prefix') || '';
                return `${iedName}|${ldInst}|${prefix}|${lnClass}|${lnInst}`;
            });
            const uniqueKeys = new Set(combinationKeys);
            return uniqueKeys.size !== combinationKeys.length;
        })
        .map((lNodeContainer) => ({
            severity: 'ERROR',
            id: 'LNodeContainer_unique_LNode_combination',
            filename: docName,
            message:
                'LNode in LNodeContainer shall have different combination of { lnInst, lnClass, iedName, ldInst, prefix }',
            element: lNodeContainer,
        }));
}
