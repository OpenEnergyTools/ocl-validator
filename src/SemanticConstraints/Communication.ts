import { areNamesUnique } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: Communication_unique_SubNetwork_name
export function Communication_unique_SubNetwork_name(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('Communication'))
        .filter((communication) => !areNamesUnique(communication.querySelectorAll('SubNetwork')))
        .map((communication) => ({
            severity: 'ERROR',
            id: 'Communication_unique_SubNetwork_name',
            filename: docName,
            message: 'SubNetwork in Communication shall have different name',
            element: communication,
        }));
}

// Rule: Communication_GSE_SMV_MACAddress_unique
export function Communication_GSE_SMV_MACAddress_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    const macAddresses = Array.from(scl.querySelectorAll('P'))
        .filter((p) => p.getAttribute('type') === 'MAC-Address')
        .map((p) => ({
            element: p,
            value: p.getAttribute('value') || p.textContent || '',
        }));

    const seenMacAddresses = new Set<string>();
    const duplicates = macAddresses.filter(({ value }) => {
        if (seenMacAddresses.has(value)) {
            return true;
        }
        seenMacAddresses.add(value);
        return false;
    });

    return duplicates.map(({ element }) => ({
        severity: 'ERROR',
        id: 'Communication_GSE_SMV_MACAddress_unique',
        filename: docName,
        message: 'GSE and SMV MAC-Addresses shall be unique in the file',
        element,
    }));
}
