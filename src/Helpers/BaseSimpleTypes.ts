// Helper functions for SCL validation
// These correspond to the helper functions in BaseSimpleTypes.ocl

export const SCL_NAMESPACE = 'http://www.iec.ch/61850/2003/SCL';

// Helper to query elements by tag name in SCL namespace
export function querySelectorAll(scl: XMLDocument, tagName: string): NodeListOf<Element> {
    return scl.querySelectorAll(`${tagName}`);
}

// Helper to query single element by tag name in SCL namespace
export function querySelector(scl: XMLDocument, tagName: string): Element | null {
    return scl.querySelector(`${tagName}`);
}

// Helper to get all elements of a specific type
export function getElementsByTagNameNS(scl: XMLDocument, tagName: string): HTMLCollectionOf<Element> {
    return scl.getElementsByTagName(tagName);
}

// Helper to check if an attribute exists and is non-null/empty
export function hasRequiredAttribute(element: Element, attrName: string): boolean {
    const attr = element.getAttribute(attrName);
    return attr !== null && attr !== '';
}

// Helper to get attribute value or empty string
export function getAttributeValue(element: Element, attrName: string): string {
    return element.getAttribute(attrName) || '';
}

// Helper to check uniqueness of names in a collection
export function areNamesUnique(elements: NodeListOf<Element> | HTMLCollectionOf<Element>, nameAttr: string = 'name'): boolean {
    const names = Array.from(elements).map(el => getAttributeValue(el, nameAttr));
    const uniqueNames = new Set(names);
    return uniqueNames.size === names.length;
}

// Helper to check uniqueness with a custom selector function
export function areUnique<T>(elements: NodeListOf<Element> | HTMLCollectionOf<Element>, selector: (el: Element) => T): boolean {
    const values = Array.from(elements).map(selector);
    const uniqueValues = new Set(values);
    return uniqueValues.size === values.length;
}

/**
 * Resolves an LN reference (iedName/ldInst/prefix/lnClass/lnInst attributes,
 * as used by Association, ClientLN, ...) to an LN0 or LN element.
 * Returns null when the reference cannot be resolved.
 */
export function findReferencedLN(scl: XMLDocument, ref: Element): Element | null {
    const iedName = getAttributeValue(ref, 'iedName');
    const ldInst = getAttributeValue(ref, 'ldInst');
    const prefix = getAttributeValue(ref, 'prefix');
    const lnClass = getAttributeValue(ref, 'lnClass');
    const lnInst = getAttributeValue(ref, 'lnInst');

    const scope = iedName ? scl.querySelector(`IED[name="${iedName}"]`) : ref.closest('IED');
    if (!scope) return null;

    const lDevices = scope.querySelectorAll('LDevice');
    for (let i = 0; i < lDevices.length; i++) {
        if (getAttributeValue(lDevices[i], 'inst') !== ldInst) continue;

        const lns = lDevices[i].querySelectorAll('LN0, LN');
        for (let j = 0; j < lns.length; j++) {
            const ln = lns[j];
            const isLN0 = ln.tagName === 'LN0';
            const classMatches = isLN0 ? lnClass === 'LLN0' : getAttributeValue(ln, 'lnClass') === lnClass;
            const instMatches = isLN0 ? lnInst === '' : getAttributeValue(ln, 'inst') === lnInst;
            const prefixMatches = getAttributeValue(ln, 'prefix') === prefix;

            if (classMatches && instMatches && prefixMatches) {
                return ln;
            }
        }
    }

    return null;
}
