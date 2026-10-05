import { ValidationIssue } from '../ValidationIssue';

// Rule: Server_one_Authentication_required
export function server_one_Authentication_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server'))
        .filter((server) => !server.querySelector(':scope > Authentication'))
        .map((server) => ({
            severity: 'ERROR',
            id: 'Server_one_Authentication_required',
            filename: docName,
            message: 'Server shall contain one Authentication',
            element: server,
        }));
}

// Rule: Server_at_least_one_LDevice_required
export function server_at_least_one_LDevice_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(':root > IED > AccessPoint > Server'))
        .filter((server) => server.querySelectorAll(':scope > LDevice').length === 0)
        .map((server) => ({
            severity: 'ERROR',
            id: 'Server_at_least_one_LDevice_required',
            filename: docName,
            message: 'Server shall contain at least one LDevice',
            element: server,
        }));
}
