import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: GSE_for_L2_GOOSE_has_right_addresses
export function GSE_for_L2_GOOSE_has_right_addresses(scl: XMLDocument, docName: string): ValidationIssue[] {
    const requiredTypes = new Set(['VLAN-ID', 'APPID', 'VLAN-PRIORITY', 'MAC-Address']);

    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork > ConnectedAP > GSE'))
        .filter((gse) => {
            const iedName = gse.parentElement?.getAttribute('iedName') ?? '';
            const apName = gse.parentElement?.getAttribute('apName') ?? '';
            const ldInst = getAttributeValue(gse, 'ldInst');
            const cbName = getAttributeValue(gse, 'cbName');

            const protocol = scl
                .querySelector(
                    `:root > IED[name="${iedName}"] > AccessPoint[name="${apName}"] > Server > LDevice[inst="${ldInst}"] > LN0 > GSEControl[name="${cbName}"]`
                )
                ?.querySelector('Protocol');
            if (protocol) return false; // R-GOOSE has Protocol, no validation needed

            // L2 GOOSE - must have all required address types and unique types
            const address = gse.querySelector(':scope > Address');
            if (!address) return false;

            const foundTypes = new Set<string>();
            Array.from(address.querySelectorAll(':scope > P')).forEach((p) => {
                const type = getAttributeValue(p, 'type');
                if (type) foundTypes.add(type);
            });

            // Check all required types are present
            for (const requiredType of requiredTypes) {
                if (!foundTypes.has(requiredType)) {
                    return true;
                }
            }

            // Check uniqueness of P types
            const types = Array.from(address.querySelectorAll(':scope > P')).map((p) => getAttributeValue(p, 'type'));
            const uniqueTypes = new Set(types.filter((t) => t !== ''));
            return uniqueTypes.size !== types.filter((t) => t !== '').length;
        })
        .map((gse) => ({
            severity: 'ERROR',
            id: 'GSE_for_L2_GOOSE_has_right_addresses',
            filename: docName,
            message: 'GSE for L2 GOOSE should have APPID VLAN_ID VLAN-PRIORITY and MAC-Address',
            element: gse,
        }));
}
