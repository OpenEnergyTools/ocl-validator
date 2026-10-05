import { ValidationIssue } from '../ValidationIssue';

// Rule: Address_at_least_one_P_required
export function address_at_least_one_P_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('Address'))
        .filter((address) => {
            const pElements = address.querySelectorAll('P');
            return pElements.length === 0;
        })
        .map((address) => ({
            severity: 'ERROR',
            id: 'Address_at_least_one_P_required',
            filename: docName,
            message: 'Address shall contain at least one P',
            element: address,
        }));
}
