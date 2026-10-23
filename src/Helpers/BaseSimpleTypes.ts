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
export function areNamesUnique(
    elements: NodeListOf<Element> | HTMLCollectionOf<Element>,
    nameAttr: string = 'name'
): boolean {
    const names = Array.from(elements).map((el) => getAttributeValue(el, nameAttr));
    const uniqueNames = new Set(names);
    return uniqueNames.size === names.length;
}

/**
 * Resolves an LN reference (iedName/ldInst/prefix/lnClass/lnInst attributes,
 * as used by Association, ClientLN, ...) to an LN0 or LN element.
 * Returns null when the reference cannot be resolved.
 */
export function findReferencedServerLN(scl: XMLDocument, ref: Element): Element | null {
    const iedName = getAttributeValue(ref, 'iedName');
    const ldInst = getAttributeValue(ref, 'ldInst');
    const prefix = getAttributeValue(ref, 'prefix');
    const lnClass = getAttributeValue(ref, 'lnClass');
    const lnInst = getAttributeValue(ref, 'lnInst');

    const base = `:root > IED[name="${iedName}"] > AccessPoint > Server > LDevice[inst="${ldInst}"] > `;
    const selectorAnyLN = `${base}LN0[lnClass="${lnClass}"], ${base}LN[lnClass="${lnClass}"]`;

    return (
        Array.from(scl.querySelectorAll(selectorAnyLN)).find((ln) => {
            if (prefix !== getAttributeValue(ln, 'prefix')) return false;
            if (lnInst !== getAttributeValue(ln, 'inst')) return false;
            return true;
        }) || null
    );
}

/**
 * Resolves an LN reference (iedName/ldInst/prefix/lnClass/lnInst attributes,
 * as used by Association, ClientLN, ...) to an LN0 or LN element.
 * Returns null when the reference cannot be resolved.
 */
export function findReferencedClientLN(scl: XMLDocument, ref: Element): Element | null {
    const iedName = getAttributeValue(ref, 'iedName');
    const apRef = getAttributeValue(ref, 'apRef');
    const prefix = getAttributeValue(ref, 'prefix');
    const lnClass = getAttributeValue(ref, 'lnClass');
    const lnInst = getAttributeValue(ref, 'lnInst');

    let selectorAnyLN = '';
    if (!!apRef) selectorAnyLN = `IED[name="${iedName}"] > AccessPoint[name="${apRef}"] > LN[lnClass="${lnClass}"]`;
    else selectorAnyLN = `IED[name="${iedName}"] > AccessPoint > LN[lnClass="${lnClass}"]`;

    return (
        Array.from(scl.querySelectorAll(selectorAnyLN)).find((ln) => {
            if (prefix !== getAttributeValue(ln, 'prefix')) return false;
            if (lnInst !== getAttributeValue(ln, 'inst')) return false;
            return true;
        }) || null
    );
}

/**
 * Resolves a DO, SDO, DA, BDA reference from DOI, SDI, DAI element in IED.
 * The function follows the path: LN/LN0 > DOI > (SDI*) > DAI
 * and finds corresponding: LNodeType > DO > DOType > DO(SDO*) > DOType > DA (or nested in DAType > BDA)
 * Returns null when the reference cannot be resolved.
 */
export function findReferencedDataType(scl: XMLDocument, doiOrSdiOrDaiOrFcda: Element): Element | null {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');
    if (!dataTypeTemplates) return null;

    const reference: string[] = [];
    let lnType: string = '';
    if (doiOrSdiOrDaiOrFcda.tagName === 'FCDA') {
        const fcda = doiOrSdiOrDaiOrFcda;
        const iedName = getAttributeValue(fcda, 'iedName');
        const ldInst = getAttributeValue(fcda, 'ldInst');
        const prefix = getAttributeValue(fcda, 'prefix') || '';
        const lnClass = getAttributeValue(fcda, 'lnClass');
        const lnInst = getAttributeValue(fcda, 'lnInst') || '';
        const doName = getAttributeValue(fcda, 'doName');
        const daName = getAttributeValue(fcda, 'daName');

        const selector = [
            `:root > IED[name="${iedName}"] > AccessPoint > Server > LDevice[inst="${ldInst}"] > LN0[lnClass="${lnClass}"]`,
            `:root > IED[name="${iedName}"] > AccessPoint > Server > LDevice[inst="${ldInst}"] > LN[lnClass="${lnClass}"]`,
        ];

        lnType =
            Array.from(scl.querySelectorAll(selector.join(', ')))
                .find((ln) => {
                    if (prefix !== getAttributeValue(ln, 'prefix')) return false;
                    if (lnInst !== getAttributeValue(ln, 'inst')) return false;
                    return true;
                })
                ?.getAttribute('lnType') || '';

        reference.push(...doName.split('.'));
        if (!!daName) reference.push(...daName.split('.'));
    } else {
        const doiOrSdiOrDai = doiOrSdiOrDaiOrFcda;
        reference.push(doiOrSdiOrDai.getAttribute('name') || '');
        let parent: Element | null = doiOrSdiOrDai.parentElement;
        while (parent && !(parent.tagName === 'LN' || parent.tagName === 'LN0')) {
            reference.unshift(parent.getAttribute('name') || '');
            parent = parent.parentElement;
        }

        lnType = doiOrSdiOrDai.closest('LN, LN0')?.getAttribute('lnType') || '';
    }

    let dataType: Element | null = dataTypeTemplates?.querySelector(`:scope > LNodeType[id="${lnType}"]`) || null;
    for (const ref of reference) {
        if (!dataType) return null;

        let child: Element | null =
            dataType.querySelector(
                `:scope > DO[name="${ref}"], :scope > SDO[name="${ref}"], :scope > DA[name="${ref}"], :scope > BDA[name="${ref}"]`
            ) || null;

        if (!child) return null;
        if (child && reference[reference.length - 1] === ref) return child;

        dataType =
            dataTypeTemplates?.querySelector(
                `:scope >DOType[id="${child.getAttribute('type')}"], :scope > DAType[id="${child.getAttribute('type')}"]`
            ) || null;
    }

    return null;
}

/**
 * Checks if the client and server are in the same SubNetwork.
 * @param clientLNoRIedName - The `ClientLN` element or `IEDName` element.
 * @param communication - The Communication element containing SubNetwork definitions.
 * @returns True if the client and server are in the same SubNetwork, false otherwise.
 */
export function isSameSubNetwork(clientLNoRIedName: Element, communication: Element): boolean {
    // Find Client SubNetwork
    const iedName = getAttributeValue(clientLNoRIedName, 'iedName');
    const apRef = getAttributeValue(clientLNoRIedName, 'apRef');
    const clientSubNetwork = communication.querySelector(
        `:scope > SubNetwork > ConnectedAP[iedName="${iedName}"][apName="${apRef}"]`
    )?.parentElement;
    if (clientSubNetwork === null) return true;

    //Find Server SubNetwork
    const serverApRef = clientLNoRIedName?.closest('AccessPoint')?.getAttribute('name');
    const serverIedName = clientLNoRIedName?.closest('IED')?.getAttribute('name');
    const senderSubNetwork = communication.querySelector(
        `ConnectedAP[iedName="${serverIedName}"][apName="${serverApRef}"]`
    )?.parentElement;
    if (senderSubNetwork === null) return true;

    return clientSubNetwork === senderSubNetwork;
}

// Checks if all child elements of a given parent element have unique values for a specified attribute.
export function checkUniqueAttributeInChildElements(
    parent: Element,
    childTagName: string,
    attributeName: string
): boolean {
    const children = Array.from(parent.querySelectorAll(`:scope > ${childTagName}`));
    const values = children.map((child) => child.getAttribute(attributeName) || '');
    const filtered = values.filter((v) => v !== '');
    return new Set(filtered).size === filtered.length;
}

/**
 * Finds the referenced LN or LN0 element in the SCL document based on the LNode attributes.
 * Uses iedName, ldInst, lnClass, prefix, and lnInst to locate the matching element.
 * Returns null if no matching element is found.
 */
export function findReferencedServerAnyLN(scl: XMLDocument, lNode: Element): Element | null {
    const iedName = getAttributeValue(lNode, 'iedName');
    const ldInst = getAttributeValue(lNode, 'ldInst');

    const lnClass = getAttributeValue(lNode, 'lnClass');
    const prefix = getAttributeValue(lNode, 'prefix');
    const lnInst = getAttributeValue(lNode, 'lnInst');

    const selector = [
        `:scope > IED[name="${iedName}"] > AccessPoint > Server > LDevice[inst="${ldInst}"] > LN[lnClass="${lnClass}"]`,
        `:scope > IED[name="${iedName}"] > AccessPoint > Server > LDevice[inst="${ldInst}"] > LN0[lnClass="${lnClass}"]`,
    ];

    return (
        Array.from(scl.querySelectorAll(selector.join(','))).find(
            (anyLn) => (anyLn.getAttribute('prefix') || '') === prefix && (anyLn.getAttribute('inst') || '') === lnInst
        ) || null
    );
}

/**
 * Recursively finds missing DO or SDO elements between two data types.
 * Compares elements by name and type, and recursively checks nested data types.
 * Returns an array of missing elements from the first data type (ours) that are not present in the second (theirs).
 */
export function findMissingDOorSDO(scl: XMLDocument, oursDataType: Element, theirsDataType: Element): Element[] {
    const dtt = scl.querySelector(':root > DataTypeTemplates')!;
    const missing: Element[] = [];

    const resolve = (id: string | null): Element | null =>
        dtt ? dtt.querySelector(`DOType[id="${id}"], DAType[id="${id}"], EnumType[id="${id}"]`) : null;

    Array.from(oursDataType.querySelectorAll(':scope > DO, :scope > SDO')).forEach((doOrSdo) => {
        const theirsDoOrSdo = theirsDataType.querySelector(
            `:scope > ${doOrSdo.tagName}[name="${doOrSdo.getAttribute('name')}"]`
        );

        if (!theirsDoOrSdo) {
            missing.push(doOrSdo);
            return;
        }

        const oursChildDataType = resolve(doOrSdo.getAttribute('type'));
        const theirChildDataType = resolve(theirsDoOrSdo.getAttribute('type'));

        if (!oursChildDataType) return;
        if (oursChildDataType && !theirChildDataType)
            missing.push(...Array.from(oursChildDataType.querySelectorAll(':scope > DO, :scope > SDO')));

        missing.push(...findMissingDOorSDO(scl, oursChildDataType, theirChildDataType!));
    });
    return missing;
}

/**
 * Recursively finds missing DA, BDA, or EnumVal elements between two data types.
 * For EnumVal, matches by ord and textContent. For other elements, matches by name.
 * Also checks bType attribute equality and recursively compares nested data types.
 * Returns an array of missing elements from the first data type that are not present in the second.
 */
export function findMissingDAorBDAorEnumVal(
    scl: XMLDocument,
    oursDataType: Element,
    theirsDataType: Element
): Element[] {
    const dtt = scl.querySelector(':root > DataTypeTemplates')!;
    const missing: Element[] = [];

    const resolve = (id: string | null): Element | null =>
        dtt ? dtt.querySelector(`DOType[id="${id}"], DAType[id="${id}"], EnumType[id="${id}"]`) : null;

    Array.from(
        oursDataType.querySelectorAll(':scope > DO, :scope > SDO, :scope > DA, :scope > BDA, :scope > EnumVal')
    ).forEach((oursDoOrSdoOrDaOrBdaOrEnumVal) => {
        let theirsDoOrSdoOrDaOrBdaOrEnumVal: Element | null = null;
        if (oursDoOrSdoOrDaOrBdaOrEnumVal.tagName === 'EnumVal') {
            const oursOrd = oursDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('ord');
            const oursContent = oursDoOrSdoOrDaOrBdaOrEnumVal.textContent;
            theirsDoOrSdoOrDaOrBdaOrEnumVal =
                Array.from(
                    theirsDataType.querySelectorAll(
                        `:scope > ${oursDoOrSdoOrDaOrBdaOrEnumVal.tagName}[ord="${oursOrd}"]`
                    )
                ).find((el) => el.textContent === oursContent) || null;

            // console.log('oursOrd:', oursOrd, 'oursContent:', oursContent, 'theirsDoOrSdoOrDaOrBdaOrEnumVal:', theirsDoOrSdoOrDaOrBdaOrEnumVal);
        } else {
            theirsDoOrSdoOrDaOrBdaOrEnumVal = theirsDataType.querySelector(
                `:scope > ${oursDoOrSdoOrDaOrBdaOrEnumVal.tagName}[name="${oursDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('name')}"]`
            );
        }

        const isDoOrSdo =
            oursDoOrSdoOrDaOrBdaOrEnumVal.tagName === 'DO' || oursDoOrSdoOrDaOrBdaOrEnumVal.tagName === 'SDO';
        if (!theirsDoOrSdoOrDaOrBdaOrEnumVal) {
            if (isDoOrSdo) return;

            missing.push(oursDoOrSdoOrDaOrBdaOrEnumVal);
            return;
        }

        if (
            oursDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('bType') !==
            theirsDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('bType')
        ) {
            missing.push(oursDoOrSdoOrDaOrBdaOrEnumVal);
            return;
        }

        const oursChildDataType = resolve(oursDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('type'));
        const theirChildDataType = resolve(theirsDoOrSdoOrDaOrBdaOrEnumVal.getAttribute('type'));

        if (!oursChildDataType) return;

        if (!theirChildDataType) {
            if (!oursChildDataType) return;
            else {
                missing.push(
                    ...Array.from(oursChildDataType.querySelectorAll(':scope > DA, :scope > BDA, :scope > EnumVal'))
                );
                return;
            }
        }

        missing.push(...findMissingDAorBDAorEnumVal(scl, oursChildDataType, theirChildDataType));
    });
    return missing;
}
