import { areNamesUnique } from '../Helpers/BaseSimpleTypes';
import { ValidationIssue } from '../ValidationIssue';

const selector =
    ':root > IED > AccessPoint > LN, :root > IED > AccessPoint > Server > LDevice >LN0, :root > IED > AccessPoint > Server > LDevice > LN';
// Rule: AnyLN_LogControl_name_unique
export function AnyLN_LogControl_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => !areNamesUnique(anyLN.querySelectorAll(':scope > LogControl')))
        .map((anyLN) => ({
            severity: 'ERROR',
            id: 'AnyLN_LogControl_name_unique',
            filename: docName,
            message: 'name of the log control block shall be unique within the AnyLN',
            element: anyLN,
        }));
}

// Rule: AnyLN_ReportControl_name_unique
export function AnyLN_ReportControl_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => !areNamesUnique(anyLN.querySelectorAll(':scope > ReportControl')))
        .map((anyLN) => ({
            severity: 'ERROR',
            id: 'AnyLN_ReportControl_name_unique',
            filename: docName,
            message: 'name of the report control block shall be unique within the AnyLN',
            element: anyLN,
        }));
}

// Rule: AnyLN_Log_name_unique
export function AnyLN_Log_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => !areNamesUnique(anyLN.querySelectorAll(':scope > Log')))
        .map((anyLN) => ({
            severity: 'ERROR',
            id: 'AnyLN_Log_name_unique',
            filename: docName,
            message: 'name of the Log shall be unique within the AnyLN',
            element: anyLN,
        }));
}

// Rule: AnyLN_DOI_name_unique
export function AnyLN_DOI_name_unique(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => {
            const dois = anyLN.querySelectorAll(':scope > DOI');
            return dois.length > 0 && !areNamesUnique(dois);
        })
        .map((anyLN) => ({
            severity: 'ERROR',
            id: 'AnyLN_DOI_name_unique',
            filename: docName,
            message: 'name of the DOI shall be unique within the AnyLN',
            element: anyLN,
        }));
}

// Rule: AnyLN_LNodeType_lnClass_consistent
export function AnyLN_LNodeType_lnClass_consistent(scl: XMLDocument, docName: string): ValidationIssue[] {
    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => {
            const refersToLNodeType = anyLN.getAttribute('lnType');
            const lnClass = anyLN.getAttribute('lnClass');

            if (!refersToLNodeType) return false;

            // Find the referenced LNodeType
            const lNodeType = scl.querySelector(`:root > DataTypeTemplates > LNodeType[id="${refersToLNodeType}"]`);
            if (!lNodeType) return false;

            const lNodeTypeLnClass = lNodeType.getAttribute('lnClass');
            return lNodeTypeLnClass !== lnClass;
        })
        .map((anyLN) => ({
            severity: 'ERROR',
            id: 'AnyLN_LNodeType_lnClass_consistent',
            filename: docName,
            message: 'lnClass shall be the same as the referenced LNodeType lnClass',
            element: anyLN,
        }));
}

// Rule: AnyLN_RefersToLNodeType
export function AnyLN_RefersToLNodeType(scl: XMLDocument, docName: string): ValidationIssue[] {
    const dataTypeTemplates = scl.querySelector(':root > DataTypeTemplates');

    if (!dataTypeTemplates) {
        // If no DataTypeTemplates section, all logical nodes must not reference LNodeTypes
        return Array.from(scl.querySelectorAll(selector))
            .filter((anyLN) => anyLN.getAttribute('lnType') !== null)
            .map((anyLN) => {
                const lnType = anyLN.getAttribute('lnType') ?? '';
                return {
                    severity: 'ERROR',
                    id: 'AnyLN_RefersToLNodeType',
                    filename: docName,
                    message: `AnyLN (lnType=${lnType}) does not refer an existing LNodeType in DataTypeTemplates section`,
                    element: anyLN,
                };
            });
    }

    return Array.from(scl.querySelectorAll(selector))
        .filter((anyLN) => {
            const refersToLNodeType = anyLN.getAttribute('lnType');
            if (!refersToLNodeType) return false;
            return !dataTypeTemplates.querySelector(`:root > DataTypeTemplates > LNodeType[id="${refersToLNodeType}"]`);
        })
        .map((anyLN) => {
            const lnType = anyLN.getAttribute('lnType') ?? '';
            return {
                severity: 'ERROR',
                id: 'AnyLN_RefersToLNodeType',
                filename: docName,
                message: `AnyLN (lnType=${lnType}) does not refer an existing LNodeType in DataTypeTemplates section`,
                element: anyLN,
            };
        });
}
