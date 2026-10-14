import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > Communication > SubNetwork > ConnectedAP > GSE',
    ':root > Communication > SubNetwork > ConnectedAP > SMV',
];

// Rule: ControlBlock_RefersToControlWithIEDName
export function ControlBlock_RefersToControlWithIEDName(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((controlBlock) => {
            const iedName = controlBlock.closest('ConnectedAP')?.getAttribute('iedName');
            const apName = controlBlock.closest('ConnectedAP')?.getAttribute('apName');
            const ldInst = controlBlock.getAttribute('ldInst');
            const cbName = controlBlock.getAttribute('cbName');

            const controlSelector = [
                `:root > IED[name="${iedName}"] > AccessPoint[name="${apName}"] > Server > LDevice[inst="${ldInst}"] > LN0 > GSEControl[name="${cbName}"]`,
                `:root > IED[name="${iedName}"] > AccessPoint[name="${apName}"] > Server > LDevice[inst="${ldInst}"] > LN0 > SampledValueControl[name="${cbName}"]`,
            ];

            return scl.querySelector(controlSelector.join(',')) === null;
        })
        .map((controlBlock) => ({
            severity: 'ERROR',
            id: 'ControlBlock_RefersToControlWithIEDName',
            filename: docName,
            message: 'ControlBlock does not refer an existing Control',
            element: controlBlock,
        }));
}
