import { ValidationIssue } from '../ValidationIssue';

// Rule: ReportControl_one_OptFields_required
export function reportControl_one_OptFields_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('ReportControl'))
        .filter((reportControl) => !reportControl.querySelector('OptFields'))
        .map((reportControl) => ({
            severity: 'ERROR',
            id: 'ReportControl_one_OptFields_required',
            filename: docName,
            message: 'ReportControl shall contain an OptFields',
            element: reportControl,
        }));
}
