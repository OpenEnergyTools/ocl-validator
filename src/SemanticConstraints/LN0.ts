import { areNamesUnique } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector = ':root > IED > AccessPoint > Server > LDevice > LN0';
// Rule: LN0_GSEControl_name_unique
export function lN0_GSEControl_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > GSEControl')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_GSEControl_name_unique',
            filename: docName,
            message: 'Unique name in GSEControl from LN0',
            element: ln0,
        }));
}

// Rule: LN0_SampledValueControl_name_unique
export function lN0_SampledValueControl_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > SampledValueControl')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_SampledValueControl_name_unique',
            filename: docName,
            message: 'Unique name in SampledValueControl from LN0',
            element: ln0,
        }));
}

// Rule: LN0_name_in_ReportControl
export function lN0_name_in_ReportControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > ReportControl')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_name_in_ReportControl',
            filename: docName,
            message: 'Unique name in ReportControl from LN0',
            element: ln0,
        }));
}

// Rule: LN0_name_in_LogControl
export function lN0_name_in_LogControl(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > LogControl')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_name_in_LogControl',
            filename: docName,
            message: 'Unique name in LogControl from LN0',
            element: ln0,
        }));
}

// Rule: LN0_name_in_DataSet
export function lN0_name_in_DataSet(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > DataSet')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_name_in_DataSet',
            filename: docName,
            message: 'Unique name in DataSet from LN0',
            element: ln0,
        }));
}

// Rule: LN0_name_in_DOI
export function lN0_name_in_DOI(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > DOI')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_name_in_DOI',
            filename: docName,
            message: 'Unique name in DOI from LN0',
            element: ln0,
        }));
}

// Rule: LN0_name_in_Log
export function lN0_name_in_Log(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((ln0) => !areNamesUnique(ln0.querySelectorAll(':scope > Log')))
        .map((ln0) => ({
            severity: 'ERROR',
            id: 'LN0_name_in_Log',
            filename: docName,
            message: 'Unique name in Log from LN0',
            element: ln0,
        }));
}
