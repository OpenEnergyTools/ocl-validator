import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: ConnectedAP_ied_exists
export function ConnectedAP_ied_exists(scl: XMLDocument, docName: string): ValidationIssue[] {
    const iedNames = new Set(
        Array.from(scl.querySelectorAll(':root > IED')).map((ied) => ied.getAttribute('name') || '')
    );

    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP'))
        .filter((connectedAP) => {
            const iedName = getAttributeValue(connectedAP, 'iedName');
            return iedName && !iedNames.has(iedName);
        })
        .map((connectedAP) => {
            const iedName = getAttributeValue(connectedAP, 'iedName');
            return {
                severity: 'ERROR',
                id: 'ConnectedAP_ied_exists',
                filename: docName,
                message: `iedName attribute shall refer to an existing IED in ConnectedAP. Current value is ${iedName}`,
                element: connectedAP,
            };
        });
}

// Rule: ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork
export function ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP'))
        .filter((connectedAP) => {
            const gses = connectedAP.querySelectorAll('GSE');
            const combinations = Array.from(gses).map((gse) => {
                const cbName = gse.getAttribute('cbName') || '';
                const ldInst = gse.getAttribute('ldInst') || '';
                return `${cbName}|${ldInst}`;
            });
            const uniqueCombinations = new Set(combinations);
            return uniqueCombinations.size !== combinations.length;
        })
        .map((connectedAP) => ({
            severity: 'ERROR',
            id: 'ConnectedAP_unique_attributes_combination_GSE_from_SubNetwork',
            filename: docName,
            message: 'Unique GSE cbName and ldInst combination in ConnectedAP from SubNetwork',
            element: connectedAP,
        }));
}

// Rule: ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork
export function ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP'))
        .filter((connectedAP) => {
            const smvs = connectedAP.querySelectorAll('SMV');
            const combinations = Array.from(smvs).map((smv) => {
                const cbName = smv.getAttribute('cbName') || '';
                const ldInst = smv.getAttribute('ldInst') || '';
                return `${cbName}|${ldInst}`;
            });
            const uniqueCombinations = new Set(combinations);
            return uniqueCombinations.size !== combinations.length;
        })
        .map((connectedAP) => ({
            severity: 'ERROR',
            id: 'ConnectedAP_unique_attributes_combination_SMV_from_SubNetwork',
            filename: docName,
            message: 'Unique SMV cbName and ldInst combination in ConnectedAP from SubNetwork',
            element: connectedAP,
        }));
}

// Rule: ConnectedAP_RefersToAccessPoint
export function ConnectedAP_RefersToAccessPoint(scl: XMLDocument, docName: string): ValidationIssue[] {
    const accessPointNames = new Set(
        Array.from(scl.querySelectorAll(':root > IED > AccessPoint')).map((ap) => ap.getAttribute('name') || '')
    );

    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP'))
        .filter((connectedAP) => {
            const apName = getAttributeValue(connectedAP, 'apName');
            return apName && !accessPointNames.has(apName);
        })
        .map((connectedAP) => {
            const apName = getAttributeValue(connectedAP, 'apName');
            return {
                severity: 'ERROR',
                id: 'ConnectedAP_RefersToAccessPoint',
                filename: docName,
                message: `ConnectedAP (apName=${apName}) does not refer an existing AccessPoint in IED section`,
                element: connectedAP,
            };
        });
}
