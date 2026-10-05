import { ValidationIssue } from '../ValidationIssue';

// Rule: History_at_least_one_Hitem_required
export function history_at_least_one_Hitem_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll('History'))
        .filter((history) => history.querySelectorAll('Hitem').length === 0)
        .map((history) => ({
            severity: 'ERROR',
            id: 'History_at_least_one_Hitem_required',
            filename: docName,
            message: 'History shall contain at least one Hitem',
            element: history,
        }));
}
