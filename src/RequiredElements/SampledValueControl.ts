import { ValidationIssue } from '../ValidationIssue';

// Rule: sampledValueControl_one_SmvOpts_required
export function sampledValueControl_one_SmvOpts_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > LDevice > LN0 >SampledValueControl'))
        .filter((sampledValueControl) => !sampledValueControl.querySelector('SmvOpts'))
        .map((sampledValueControl) => ({
            severity: 'ERROR',
            id: 'sampledValueControl_one_SmvOpts_required',
            filename: docName,
            message: 'SampledValueControl shall contain a SmvOpts',
            element: sampledValueControl,
        }));
}

// Rule: sampledValueControl_multicast
export function sampledValueControl_multicast(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server > LDevice > LN0 >SampledValueControl'))
        .filter((sampledValueControl) => {
            const multicast = sampledValueControl.getAttribute('multicast');
            const isUnicast = multicast === 'false' || multicast === '0' || multicast?.toLowerCase() === 'false';

            if (!isUnicast) {
                return false;
            }

            const iedNames = sampledValueControl.querySelectorAll(':scope > IEDName');
            return iedNames.length > 1;
        })
        .map((sampledValueControl) => ({
            severity: 'ERROR',
            id: 'sampledValueControl_multicast',
            filename: docName,
            message: 'If Multicast is FALSE, a maximum of one client IED shall be assigned to the SampledValueControl',
            element: sampledValueControl,
        }));
}
