import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > ReportControl',
    ':root > IED > AccessPoint > Server > LDevice > LN > ReportControl',
    ':root > IED > AccessPoint > Server > LDevice > LN0 > LogControl',
    ':root > IED > AccessPoint > Server > LDevice > LN > LogControl',
    ':root > IED > AccessPoint > Server > LDevice > LN0 > GSEControl',
    ':root > IED > AccessPoint > Server > LDevice > LN0 > SampledValueControl',
];

// Rule: Control_RefersToDataSet
export function Control_RefersToDataSet(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(',')))
        .filter((control) => {
            const datSet = getAttributeValue(control, 'datSet');
            if (!datSet) return false;

            const parent = control.parentElement;
            if (!parent) return true;

            const dataSet = parent.querySelector(`DataSet[name="${datSet}"]`);
            return !dataSet;
        })
        .map((control) => {
            const name = getAttributeValue(control, 'name');
            return {
                severity: 'ERROR',
                id: 'Control_RefersToDataSet',
                filename: docName,
                message: `Control (name=${name}) does not refer an existing DataSet`,
                element: control,
            };
        });
}
