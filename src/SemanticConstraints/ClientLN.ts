import { findReferencedClientLN, getAttributeValue, isSameSubNetwork } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > ReportControl > RptEnabled > ClientLN',
    ':root > IED > AccessPoint > Server > LDevice > LN > ReportControl > RptEnabled > ClientLN',
];

// Rule: ClientLN_RefersToLNodeType
export function ClientLN_RefersToLNodeType(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((clientLN) => !findReferencedClientLN(scl, clientLN))
        .map((clientLN) => ({
            severity: 'ERROR',
            id: 'ClientLN_RefersToLNodeType',
            filename: docName,
            message: 'ClientLN does not refer an existing LN',
            element: clientLN,
        }));
}

// Rule: ClientLN_Sender_and_receiver_not_in_same_subnetwork
export function ClientLN_Sender_and_receiver_not_in_same_subnetwork(
    scl: XMLDocument,
    docName: string
): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((clientLN) => {
            // Skip check if there is no Communication section in the SCL document
            const communication = scl.querySelector(':root > Communication');
            if (!communication) return false;

            return !isSameSubNetwork(clientLN, communication);
        })
        .map((clientLN) => ({
            severity: 'ERROR',
            id: 'ClientLN_Sender_and_receiver_not_in_same_subnetwork',
            filename: docName,
            message: 'Sender and receiver of the Report are not in the same Subnetwork',
            element: clientLN,
        }));
}
