import { findReferencedClientLN, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > ReportControl > RptEnabled > ClientLN',
    ':root > IED > AccessPoint > Server > LDevice > LN > ReportControl > RptEnabled > ClientLN',
];

// Rule: ClientLN_RefersToLNodeType
export function ClientLN_RefersToLNodeType(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(
        scl.querySelectorAll(selector.join(','))
    )
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

            // Find Client SubNetwork
            const iedName = getAttributeValue(clientLN, 'iedName');
            const apRef = getAttributeValue(clientLN, 'apRef');
            const clientSubNetwork = communication.querySelector(
                `:scope > SubNetwork > ConnectedAP[iedName="${iedName}"][apName="${apRef}"]`
            )?.parentElement;
            if (clientSubNetwork === null) return true;

            //Find Server SubNetwork
            const serverApRef = clientLN?.closest('AccessPoint')?.getAttribute('name');
            const serverIedName = clientLN?.closest('IED')?.getAttribute('name');
            const senderSubNetwork = communication.querySelector(
                `ConnectedAP[iedName="${serverIedName}"][apName="${serverApRef}"]`
            )?.parentElement;
            if (senderSubNetwork === null) return true;

            return clientSubNetwork !== senderSubNetwork;
        })
        .map((clientLN) => ({
            severity: 'ERROR',
            id: 'ClientLN_Sender_and_receiver_not_in_same_subnetwork',
            filename: docName,
            message: 'Sender and receiver of the Report are not in the same Subnetwork',
            element: clientLN,
        }));
}
