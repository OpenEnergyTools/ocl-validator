import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: AccessPoint_restriction_on_content
export function accessPoint_restriction_on_content(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint'))
        .filter((accessPoint) => {
            const server = accessPoint.querySelector(':scope > Server');
            const serverAt = accessPoint.querySelector(':scope > ServerAt');
            const lns = accessPoint.querySelectorAll(':scope > LN');

            const serverPresent = server ? 1 : 0;
            const serverAtPresent = serverAt ? 1 : 0;
            const lnPresent = lns.length > 0 ? 1 : 0;

            return serverPresent + serverAtPresent + lnPresent > 1;
        })
        .map((accessPoint) => ({
            severity: 'ERROR',
            id: 'AccessPoint_restriction_on_content',
            filename: docName,
            message: 'AccessPoint shall contain one Server xor one ServerAt xor at least one LN xor none of them',
            element: accessPoint,
        }));
}

// Rule: AccessPoint_at_most_securities
export function accessPoint_at_most_securities(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint'))
        .filter((accessPoint) => {
            const gooseSecurities = accessPoint.querySelectorAll(':scope > GOOSESecurity');
            const smvSecurities = accessPoint.querySelectorAll(':scope > SMVSecurity');

            return gooseSecurities.length > 7 || smvSecurities.length > 7;
        })
        .map((accessPoint) => ({
            severity: 'ERROR',
            id: 'AccessPoint_at_most_securities',
            filename: docName,
            message: 'AccessPoint shall contain at most 7 GOOSESecurity and at most 7 SMVSecurity',
            element: accessPoint,
        }));
}

// Rule: AccessPoint_securities_allowed
export function accessPoint_securities_allowed(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('AccessPoint'))
        .filter((accessPoint) => {
            const gooseSecurities = accessPoint.querySelectorAll(':scope > GOOSESecurity');
            const smvSecurities = accessPoint.querySelectorAll(':scope > SMVSecurity');

            if (gooseSecurities.length === 0 && smvSecurities.length === 0) {
                return false; // No securities, rule doesn't apply
            }

            // Check if Server exists and has Authentication with certificate=true
            const server = accessPoint.querySelector(':scope > Server');
            const authentication = server ? server.querySelector(':scope > Authentication') : null;
            const certificate = authentication ? getAttributeValue(authentication, 'certificate') : undefined;

            return certificate !== 'true';
        })
        .map((accessPoint) => ({
            severity: 'ERROR',
            id: 'AccessPoint_securities_allowed',
            filename: docName,
            message:
                'AccessPoint shall contain GOOSESecurity or SMVSecurity only if if the attribute certificate of the server\u2019s Authentication element is true',
            element: accessPoint,
        }));
}
