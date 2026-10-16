import { areNamesUnique, getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

// Rule: IED_AccessPoint_name_unique
export function IED_AccessPoint_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED'))
        .filter((ied) => !areNamesUnique(ied.querySelectorAll(':scope > AccessPoint')))
        .map((ied) => ({
            severity: 'ERROR',
            id: 'IED_AccessPoint_name_unique',
            filename: docName,
            message: 'AccessPoint in IED shall have different name',
            element: ied,
        }));
}

// Rule: IED_LDevice_inst_unique
export function IED_LDevice_inst_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED'))
        .filter((ied) => {
            const lDevices = ied.querySelectorAll(':scope > AccessPoint > Server > LDevice');
            const insts = Array.from(lDevices).map((ld) => getAttributeValue(ld, 'inst'));
            const uniqueInsts = new Set(insts);
            return uniqueInsts.size !== insts.length;
        })
        .map((ied) => ({
            severity: 'ERROR',
            id: 'IED_LDevice_inst_unique',
            filename: docName,
            message: 'LDevice in IED shall have different inst',
            element: ied,
        }));
}
