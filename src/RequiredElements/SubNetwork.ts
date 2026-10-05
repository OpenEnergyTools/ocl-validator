import { ValidationIssue } from '../ValidationIssue';

// Rule: SubNetwork_at_least_one_ConnectedAP_required
export function subNetwork_at_least_one_ConnectedAP_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > Communication > SubNetwork'))
        .filter((subNetwork) => subNetwork.querySelectorAll('ConnectedAP').length === 0)
        .map((subNetwork) => ({
            severity: 'ERROR',
            id: 'SubNetwork_at_least_one_ConnectedAP_required',
            filename: docName,
            message: 'SubNetwork shall contain at least one ConnectedAP',
            element: subNetwork,
        }));
}
