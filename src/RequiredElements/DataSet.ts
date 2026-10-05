import { ValidationIssue } from '../ValidationIssue';

// Rule: DataSet_at_least_one_FCDA_required
export function dataSet_at_least_one_FCDA_required(scl: XMLDocument, docName: string): ValidationIssue[] {
    const selectors = [
        ':root > IED > AccessPoint > Server > LDevice > LN0 > DataSet',
        ':root > IED > AccessPoint > Server > LDevice > LN > DataSet',
    ];
    return Array.from(scl.querySelectorAll(selectors.join(',')))
        .filter((dataSet) => {
            const fcdas = dataSet.querySelectorAll('FCDA');
            return fcdas.length === 0;
        })
        .map((dataSet) => ({
            severity: 'ERROR',
            id: 'DataSet_at_least_one_FCDA_required',
            filename: docName,
            message: 'DataSet shall contain at least one FCDA',
            element: dataSet,
        }));
}
