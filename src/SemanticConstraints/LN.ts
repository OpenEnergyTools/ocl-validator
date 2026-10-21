import { checkUniqueAttributeInChildElements } from '../Helpers';
import { ValidationIssue } from '../ValidationIssue';

const selector = ':root > IED > AccessPoint > Server > LDevice > LN';
// Rule: LN_unique_name_in_ReportControl
export function lN_unique_name_in_ReportControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'ReportControl', 'name');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_name_in_ReportControl',
            filename: docName,
            message: 'Unique name in ReportControl from LN',
            element: ln,
        }));
}

// Rule: LN_unique_datSet_in_ReportControl
export function lN_unique_datSet_in_ReportControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'ReportControl', 'datSet');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_datSet_in_ReportControl',
            filename: docName,
            message: 'Unique datSet in ReportControl from LN',
            element: ln,
        }));
}

// Rule: LN_unique_name_in_LogControl
export function lN_unique_name_in_LogControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'LogControl', 'name');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_name_in_LogControl',
            filename: docName,
            message: 'Unique name in LogControl from LN',
            element: ln,
        }));
}

// Rule: LN_unique_datSet_in_LogControl
export function lN_unique_datSet_in_LogControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'LogControl', 'datSet');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_datSet_in_LogControl',
            filename: docName,
            message: 'Unique datSet in LogControl from LN',
            element: ln,
        }));
}

// Rule: LN_unique_name_in_DataSet
export function lN_unique_name_in_DataSet(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'DataSet', 'name');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_name_in_DataSet',
            filename: docName,
            message: 'Unique name in DataSet from LN',
            element: ln,
        }));
}

// Rule: LN_unique_name_in_DOI
export function lN_unique_name_in_DOI(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'DOI', 'name');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_name_in_DOI',
            filename: docName,
            message: 'Unique name in DOI from LN',
            element: ln,
        }));
}

// Rule: LN_unique_name_in_Log
export function lN_unique_name_in_Log(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln) => {
            return !checkUniqueAttributeInChildElements(ln, 'Log', 'name');
        })
        .map((ln) => ({
            severity: 'ERROR',
            id: 'LN_unique_name_in_Log',
            filename: docName,
            message: 'Unique name in Log from LN',
            element: ln,
        }));
}
