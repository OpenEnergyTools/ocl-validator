import { getAttributeValue } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = [
    ':root > IED > AccessPoint > Server > LDevice > LN0 > LogControl',
    ':root > IED > AccessPoint > Server > LDevice > LN > LogControl',
];
//Role: LogControl_datSet_valid_reference
export function LogControl_datSet_valid_reference(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(', ')))
        .filter((logControl) => {
            const datSet = getAttributeValue(logControl, 'datSet');
            if (!datSet) return false;

            const anyLN = logControl.closest('LN0, LN');
            if (!anyLN) return false;

            const dataSet = anyLN.querySelector(`:scope > DataSet[name="${datSet}"]`);
            return !dataSet;
        })
        .map((logControl) => ({
            severity: 'ERROR',
            id: 'LogControl_datSet_valid_reference',
            filename: docName,
            message: 'datSet attribute shall reference a valid DataSet in LLN0 in GSEControl',
            element: logControl,
        }));
}

//Role: LogControl_RefersToLog
export function LogControl_RefersToLog(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector.join(', ')))
        .filter((logControl) => {
            const ldInst = getAttributeValue(logControl, 'ldInst');
            const prefix = getAttributeValue(logControl, 'prefix');
            const lnClass = getAttributeValue(logControl, 'lnClass');
            const lnInst = getAttributeValue(logControl, 'lnInst');
            const logName = getAttributeValue(logControl, 'logName');

            let lOG: Element | null = null;
            if (ldInst)
                lOG =
                    Array.from(
                        logControl
                            .closest('Server')!
                            .querySelectorAll(`:scope > LDevice[inst="${ldInst}"] > *[lnClass="${lnClass}"]`)
                    )
                        .find(
                            (anyLN) =>
                                (anyLN?.getAttribute('prefix') || '') === prefix &&
                                (anyLN?.getAttribute('inst') || '') === lnInst
                        )
                        ?.querySelector(`:scope > Log[name="${logName}"]`) || null;
            else if (!ldInst && lnClass)
                lOG =
                    Array.from(logControl.closest('LDevice')!.querySelectorAll(`:scope > *[lnClass="${lnClass}"]`))
                        .find(
                            (anyLN) =>
                                (anyLN?.getAttribute('prefix') || '') === prefix &&
                                (anyLN?.getAttribute('inst') || '') === lnInst
                        )
                        ?.querySelector(`:scope > Log[name="${logName}"]`) || null;
            else lOG = logControl.closest('LN0, LN')?.querySelector(`:scope > Log[name="${logName}"]`) || null;

            return !lOG;
        })
        .map((logControl) => ({
            severity: 'ERROR',
            id: 'LogControl_RefersToLog',
            filename: docName,
            message: 'LogControl does not refer an existing Log',
            element: logControl,
        }));
}
